import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function Cashiers() {
  const [cashiers, setCashiers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCashiers();
  }, []);

  const loadCashiers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "cashier"));

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setCashiers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCashier = async (id) => {
    if (!window.confirm("Delete this cashier?")) return;

    await deleteDoc(doc(db, "cashier", id));
    loadCashiers();
  };

  const filtered = cashiers.filter((item) => {
    const txt = search.toLowerCase();

    return (
      item.fullName?.toLowerCase().includes(txt) ||
      item.username?.toLowerCase().includes(txt) ||
      item.phone?.toLowerCase().includes(txt)
    );
  });

  return (
    <div style={{ padding: 25 }}>
      <h1
        style={{
          color: "#0b6b45",
          marginBottom: 20,
        }}
      >
        Cashiers
      </h1>

      <input
        type="text"
        placeholder="Search cashier..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: 350,
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
          border: "1px solid #ccc",
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
              color: "#fff",
            }}
          >
            <th style={th}>Name</th>
            <th style={th}>Username</th>
            <th style={th}>Phone</th>
            <th style={th}>Password</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td style={td}>{item.fullName}</td>
              <td style={td}>{item.username}</td>
              <td style={td}>{item.phone}</td>
              <td style={td}>{item.password}</td>

              <td style={td}>
                <button
                  style={{
                    background: "red",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                  onClick={() => deleteCashier(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 20 }}>
        Total Cashiers : {filtered.length}
      </h3>
    </div>
  );
}

const th = {
  border: "1px solid #ddd",
  padding: 12,
};

const td = {
  border: "1px solid #ddd",
  padding: 10,
};