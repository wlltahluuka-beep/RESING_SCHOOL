import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const currentMonthKey = () => new Date().toISOString().slice(0, 7);

export default function Parents() {
  const [parents, setParents] = useState([]);
  const [payments, setPayments] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadParents();
    loadPayments();
  }, []);

  async function loadParents() {
    const snap = await getDocs(collection(db, "students"));

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setParents(data);
  }

  async function loadPayments() {
    const snap = await getDocs(collection(db, "payments"));

    const map = {};
    snap.docs.forEach((doc) => {
      map[doc.id] = doc.data();
    });

    setPayments(map);
  }

 const filtered = useMemo(() => {
  const q = search.toLowerCase();

  return parents.filter((item) => {
    return (
      String(item.studentId || "").toLowerCase().includes(q) ||
      String(item.fullName || "").toLowerCase().includes(q) ||
      String(item.className || "").toLowerCase().includes(q)
    );
  });
}, [parents, search]);

  return (
    <div style={{ padding: 25 }}>

      <h1
        style={{
          color: "#0b6b45",
          marginBottom: 20,
        }}
      >
        Parents Information
      </h1>

      <input
        type="text"
        placeholder="Search Student ID / Student Name / Class..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: 450,
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 15,
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#0b6b45",
              color: "white",
            }}
          >
            <th style={th}>Student ID</th>
            <th style={th}>Student Name</th>
            <th style={th}>Class</th>
            <th style={th}>Fee</th>
            <th style={th}>Parent Phone</th>
            <th style={th}>Student Phone</th>
            <th style={th}>Password</th>
            <th style={th}>Payment Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td style={td}>{item.studentId}</td>
              <td style={td}>{item.fullName}</td>
              <td style={td}>{item.className}</td>
              <td style={td}>${item.monthlyFee}</td>
              <td style={td}>{item.parentPhone}</td>
              <td style={td}>{item.studentPhone}</td>
              <td style={td}>{item.parentPassword}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <h3>
        Total Parents : <span style={{color:"#0b6b45"}}>{filtered.length}</span>
      </h3>

    </div>
  );
}

const th = {
  padding: 12,
  border: "1px solid #ddd",
};

const td = {
  padding: 10,
  border: "1px solid #ddd",
};