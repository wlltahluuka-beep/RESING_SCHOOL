import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const currentMonthKey = () => new Date().toISOString().slice(0, 7); // e.g. "2026-07"

export default function Payments() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});
  const [search, setSearch] = useState("");
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const studentsSnap = await getDocs(collection(db, "cashier"));
      const studentData = studentsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setStudents(studentData);

      const paymentsSnap = await getDocs(collection(db, "payments"));
      const paymentMap = {};
      paymentsSnap.docs.forEach((d) => {
        paymentMap[d.id] = d.data();
      });
      setPayments(paymentMap);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) => {
    const text = search.toLowerCase();

    return (
      (s.studentId || "").toLowerCase().includes(text) ||
      (s.studentName || "").toLowerCase().includes(text) ||
      (s.className || "").toLowerCase().includes(text)
    );
  });

  const isPaidThisMonth = (studentId) => {
    const record = payments[studentId];
    if (!record) return false;
    return record.monthKey === currentMonthKey() && record.status === "Paid";
  };

  const savePayment = async (student) => {
    const entered = Number(amounts[student.id] || 0);

    if (entered <= 0) {
      alert("Enter payment amount");
      return;
    }

    const fee = Number(student.monthlyFee || 0);
    const remaining = fee - entered;
    const status = remaining <= 0 ? "Paid" : "Not Paid";

    try {
      await setDoc(doc(db, "payments", student.studentId), {
        studentId: student.studentId,
        studentName: student.studentName,
        className: student.className || "",
        monthlyFee: fee,
        paidAmount: entered,
        remaining: remaining > 0 ? remaining : 0,
        status,
        monthKey: currentMonthKey(),
        studentPhone: student.studentPhone,
        parentPhone: student.parentPhone,
        createdAt: serverTimestamp(),
      });

      setPayments({
        ...payments,
        [student.studentId]: {
          status,
          monthKey: currentMonthKey(),
          paidAmount: entered,
          remaining: remaining > 0 ? remaining : 0,
        },
      });

      alert("Payment Saved: " + status);

      setAmounts({
        ...amounts,
        [student.id]: "",
      });
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#0B6B45" }}>💰 Student Payments</h1>

      <input
        placeholder="Search Student ID / Name / Class"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: 350,
          padding: 10,
          marginBottom: 20,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table
          width="100%"
          cellPadding={10}
          border="1"
          style={{ borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#0B6B45", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Student Phone</th>
              <th>Parent Phone</th>
              <th>Monthly Fee</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Enter Amount</th>
              <th>Status</th>
              <th>Save</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((student) => {
              const paidThisMonth = isPaidThisMonth(student.studentId);
              const record = payments[student.studentId];

              const entered = Number(amounts[student.id] || 0);
              const fee = Number(student.monthlyFee || 0);

              let displayPaid = paidThisMonth ? record.paidAmount : entered;
              let displayRemaining = paidThisMonth
                ? record.remaining
                : Math.max(fee - entered, 0);

              const status = paidThisMonth
                ? "Paid"
                : entered > 0
                ? entered >= fee
                  ? "Paid"
                  : "Not Paid"
                : "Not Paid";

              return (
                <tr key={student.id}>
                  <td>{student.studentId}</td>
                  <td>{student.studentName}</td>
                  <td>{student.className || "-"}</td>
                  <td>{student.studentPhone || "-"}</td>
                  <td>{student.parentPhone || "-"}</td>
                  <td>${fee}</td>
                  <td>${displayPaid}</td>
                  <td>${displayRemaining}</td>
                  <td>
                    <input
                      type="number"
                      disabled={paidThisMonth}
                      value={amounts[student.id] || ""}
                      onChange={(e) =>
                        setAmounts({
                          ...amounts,
                          [student.id]: e.target.value,
                        })
                      }
                      style={{
                        width: 90,
                        padding: 8,
                        background: paidThisMonth ? "#f0f0f0" : "white",
                      }}
                    />
                  </td>
                  <td
                    style={{
                      color: status === "Paid" ? "#0B6B45" : "#e74c3c",
                      fontWeight: "bold",
                    }}
                  >
                    {status}
                  </td>
                  <td>
                    <button
                      onClick={() => savePayment(student)}
                      disabled={paidThisMonth}
                      style={{
                        background: paidThisMonth ? "#aaa" : "#00B894",
                        color: "#fff",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: 6,
                        cursor: paidThisMonth ? "not-allowed" : "pointer",
                      }}
                    >
                      {paidThisMonth ? "Paid" : "Save"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}