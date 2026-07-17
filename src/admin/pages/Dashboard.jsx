import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCard from "../components/DashboardCard";
import StatMiniCard from "../components/StatMiniCard";
import StudentDetailModal from "../components/StudentDetailModal";
import "../styles/dashboard.css";

export default function Dashboard() {
  // ---- States-ka xogta Dashboard-ka ----
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [parentsCount, setParentsCount] = useState(0);
  const [classesCount, setClassesCount] = useState(0);
  const [cashiersCount, setCashiersCount] = useState(0);

  const [recentStudents, setRecentStudents] = useState([]);
  const [classStudentCounts, setClassStudentCounts] = useState([]); // Class -> tirada ardayda
  const [recentMessages, setRecentMessages] = useState([]);

  const [loading, setLoading] = useState(true);

  // ---- Ardayga hadda la doortay (modal-ka faahfaahinta) ----
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);

      // ---- 1) Soo qaad Students-ka oo dhan ----
      const studentsSnap = await getDocs(collection(db, "students"));
      const studentsList = studentsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudentsCount(studentsList.length);

      // ---- 2) Soo qaad Teachers-ka ----
      const teachersSnap = await getDocs(collection(db, "teachers"));
      setTeachersCount(teachersSnap.docs.length);

      // Cashiers Count
      const cashierSnap = await getDocs(collection(db, "cashier"));
      setCashiersCount(cashierSnap.docs.length);

      // ---- 3) Tirada Parents-ka: waxaan ka soo saarnaa studentsList
      // (parentPhone unique ah ayaan u tirinaynaa si aan labanlaab u yeelan)
      const uniqueParentPhones = new Set(
        studentsList
          .map((s) => s.parentPhone)
          .filter((phone) => phone && phone.trim() !== "")
      );
      setParentsCount(uniqueParentPhones.size);

      // ---- 4) Classes: ka soo saar studentsList (className unique)
      const uniqueClasses = new Set(
        studentsList
          .map((s) => s.className)
          .filter((cls) => cls && cls.trim() !== "")
      );
      setClassesCount(uniqueClasses.size);

      // ---- 5) Recent Students (5-ta ugu dambeeyay ee la diiwaan geliyay)
      const recentQuery = query(
        collection(db, "students"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const recentSnap = await getDocs(recentQuery);
      setRecentStudents(
        recentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      // ---- 6) Tirinta ardayda class kasta (Class -> Count) ----
      const classCounts = {};
      studentsList.forEach((s) => {
        const cls = s.className || "Unknown";
        classCounts[cls] = (classCounts[cls] || 0) + 1;
      });
      const classCountsArray = Object.entries(classCounts).map(
        ([className, count]) => ({ className, count })
      );
      // Kor-u-kaca ugu badan
      classCountsArray.sort((a, b) => b.count - a.count);
      setClassStudentCounts(classCountsArray);

      // ---- 7) Fariimaha ugu dambeeyay (Parents/Teachers/Students) ----
      try {
        const messagesQuery = query(
          collection(db, "messages"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const messagesSnap = await getDocs(messagesQuery);
        setRecentMessages(
          messagesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (msgErr) {
        console.warn("Collection-ka messages weli ma jiro ama waa madhan:", msgErr);
        setRecentMessages([]);
      }
    } catch (error) {
      console.error("Khalad ayaa dhacay markii xogta Dashboard laga soo qaadanayay:", error);
    } finally {
      setLoading(false);
    }
  }

  // ---- Marka macalinku kaydiyo wax-ka-bedelka ardayga (edit) ----
  function handleStudentUpdated(updatedStudent) {
    setRecentStudents((prev) =>
      prev.map((s) =>
        s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s
      )
    );
    setSelectedStudent((prev) =>
      prev && prev.id === updatedStudent.id ? { ...prev, ...updatedStudent } : prev
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0b0a1c",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ padding: "20px 24px 0" }}>
          <Topbar />
        </div>

        <div style={{ padding: "26px 30px" }}>
          {/* ---- Cards-ka tirakoobka sare (Teachers / Cashiers / Parents / Classes) ---- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "20px",
            }}
          >
            <DashboardCard
              title="Teachers"
              value={loading ? "..." : teachersCount}
              icon="🧑‍🏫"
              color="#22c55e"
              percent="20%"
            />

            <DashboardCard
              title="Cashiers"
              value={loading ? "..." : cashiersCount}
              icon="💰"
              color="#ef4444"
              percent="15%"
            />

            <DashboardCard
              title="Parents"
              value={loading ? "..." : parentsCount}
              icon="👨‍👩‍👧"
              color="#c084fc"
              percent="10%"
            />

            <DashboardCard
              title="Classes"
              value={loading ? "..." : classesCount}
              icon="🏫"
              color="#f59e0b"
              percent="18%"
            />
          </div>

          {/* ---- Recent Students + Fariimaha ---- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "20px",
              marginTop: "22px",
              alignItems: "start",
            }}
          >
            {/* ---- Recent Students card ---- */}
            <div
              style={{
                background: "linear-gradient(160deg,#1c1840,#211c48)",
                borderRadius: "18px",
                padding: "22px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px" }}>🎓</span>
                  <h2 style={{ color: "#fff", fontSize: "17px", margin: 0 }}>Recent Students</h2>
                </div>
                <button
                  style={{
                    background: "linear-gradient(90deg,#6d5df0,#8b6cf5)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View All
                </button>
              </div>

              {loading ? (
                <p style={{ color: "#8b87ad", marginTop: "20px" }}>Loading...</p>
              ) : recentStudents.length === 0 ? (
                <p style={{ color: "#8b87ad", marginTop: "20px" }}>
                  Weli arday lama diiwaan gelin.
                </p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "18px" }}>
                  <thead>
                    <tr style={{ textAlign: "left" }}>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Class</th>
                      <th style={thStyle}>Phone</th>
                      <th style={thStyle}>Date Added</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((s, idx) => (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedStudent(s)}
                        style={{
                          cursor: "pointer",
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td style={tdStyle}>{String(idx + 1).padStart(2, "0")}</td>
                        <td style={{ ...tdStyle, color: "#fff", fontWeight: 500 }}>
                          {s.fullName || "—"}
                        </td>
                        <td style={tdStyle}>{s.className || "—"}</td>
                        <td style={tdStyle}>{s.studentPhone || s.parentPhone || "—"}</td>
                        <td style={tdStyle}>
                          {s.createdAt?.toDate
                            ? s.createdAt.toDate().toLocaleDateString()
                            : s.createdAt || "—"}
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              width: "26px",
                              height: "26px",
                              borderRadius: "50%",
                              background: "linear-gradient(90deg,#6d5df0,#8b6cf5)",
                              color: "#fff",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                            }}
                          >
                            →
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div style={{ textAlign: "center", marginTop: "18px" }}>
                <button
                  style={{
                    background: "linear-gradient(90deg,#6d5df0,#8b6cf5)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 28px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  View All Students 👥
                </button>
              </div>

              {/* ---- Tirada ardayda class kasta ---- */}
              <h2 style={{ color: "#fff", fontSize: "15px", marginTop: "30px" }}>
                Ardayda Class Kasta
              </h2>
              {loading ? (
                <p style={{ color: "#8b87ad" }}>Loading...</p>
              ) : classStudentCounts.length === 0 ? (
                <p style={{ color: "#8b87ad" }}>Wax class ah lama diiwaan gelin.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                  {classStudentCounts.map((c) => (
                    <div
                      key={c.className}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "10px",
                        color: "#d7d5ea",
                        fontSize: "13px",
                      }}
                    >
                      <span>Class {c.className}</span>
                      <strong style={{ color: "#fff" }}>{c.count} arday</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ---- Fariimaha (Messages) ---- */}
            <div
              style={{
                background: "linear-gradient(155deg,#6d5df0,#4c3fc4)",
                borderRadius: "18px",
                padding: "22px",
                minHeight: "300px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h2 style={{ color: "#fff", fontSize: "18px", margin: 0, maxWidth: "70%" }}>
                  Fariimaha Ugu Dambeeyay
                </h2>
                <span
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                  }}
                >
                  🔔
                </span>
              </div>

              {loading ? (
                <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "16px" }}>Loading...</p>
              ) : recentMessages.length === 0 ? (
                <>
                  <p style={{ color: "rgba(255,255,255,0.85)", marginTop: "10px", fontSize: "14px" }}>
                    Weli fariin lama helin.
                  </p>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "70px" }}>✉️</span>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                  {recentMessages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                        paddingBottom: "10px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong style={{ color: "#fff", fontSize: "13px" }}>
                          {m.senderName || "Qof aan la aqoon"}
                        </strong>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.2)",
                            color: "#fff",
                          }}
                        >
                          {m.senderRole || "—"}
                        </span>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.85)", margin: "4px 0 0", fontSize: "13px" }}>
                        {m.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <button
                style={{
                  marginTop: "16px",
                  alignSelf: "flex-start",
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 18px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Send Announcement ➤
              </button>
            </div>
          </div>

          {/* ---- Bottom mini stats row ---- */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "20px",
              marginTop: "22px",
            }}
          >
            <StatMiniCard
              title="Dhammaan Ardayda"
              subtitle="Tirada guud ee ardayda diiwaan gashan"
              value={loading ? "..." : studentsCount}
              trend={12}
              icon="👥"
              iconBg="linear-gradient(135deg,#16a34a,#22c55e)"
              lineColor="#4ade80"
            />
            <StatMiniCard
              title="Dhammaan Macallimiinta"
              subtitle="Tirada guud ee macallimiinta"
              value={loading ? "..." : teachersCount}
              trend={0}
              icon="🎓"
              iconBg="linear-gradient(135deg,#9333ea,#c084fc)"
              lineColor="#c084fc"
            />
            <StatMiniCard
              title="Dhammaan Fasalada"
              subtitle="Fasalada la diiwaan galiyay"
              value={loading ? "..." : classesCount}
              trend={0}
              icon="📖"
              iconBg="linear-gradient(135deg,#d97706,#f59e0b)"
              lineColor="#f59e0b"
            />
            <StatMiniCard
              title="Khasnadayaasha"
              subtitle="Dhammaan khasnadayaasha"
              value={loading ? "..." : cashiersCount}
              trend={5}
              icon="👛"
              iconBg="linear-gradient(135deg,#dc2626,#f87171)"
              lineColor="#f87171"
            />
          </div>
        </div>
      </div>

      {/* ---- Modal-ka faahfaahinta ardayga (view/edit) ---- */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdated={handleStudentUpdated}
        />
      )}
    </div>
  );
}

const thStyle = {
  padding: "8px",
  color: "#8b87ad",
  fontSize: "12px",
  fontWeight: 600,
};

const tdStyle = {
  padding: "12px 8px",
  color: "#a9a6c4",
  fontSize: "13px",
};