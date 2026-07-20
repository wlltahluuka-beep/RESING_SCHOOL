import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Download, ChevronRight, ChevronLeft } from "lucide-react";

const cardStyle = {
  background: "#fff",
  borderRadius: 18,
  padding: "22px 24px",
  boxShadow: "0 4px 18px rgba(17,24,39,0.06)",
  border: "1px solid rgba(17,24,39,0.05)",
};

export default function Exams() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);

      const [studentsSnap, examsSnap, resultsSnap] = await Promise.all([
        getDocs(collection(db, "students")),
        getDocs(collection(db, "exams")),
        getDocs(collection(db, "results")),
      ]);

      setStudents(studentsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setExams(examsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setResults(resultsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Khalad ayaa dhacay markii xogta Exams laga soo qaadanayay:", err);
    } finally {
      setLoading(false);
    }
  }

  // Group everything by class, using each student's className as the
  // source of truth (exams/results carry className too, but a student's
  // own record is what decides which class roster they belong to).
  const classes = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.className && s.className.trim() !== "") set.add(s.className);
    });
    exams.forEach((e) => {
      if (e.className && e.className.trim() !== "") set.add(e.className);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [students, exams]);

  const examsForClass = useMemo(() => {
    if (!selectedClass) return [];
    return exams
      .filter((e) => e.className === selectedClass)
      .sort((a, b) => (a.subject || "").localeCompare(b.subject || ""));
  }, [exams, selectedClass]);

  // Build one spreadsheet-style table for the selected class: one row per
  // student, one column per subject/exam, plus Total and Average columns —
  // exactly like an Excel gradebook.
  const gradebook = useMemo(() => {
    if (!selectedClass) return { subjects: [], rows: [] };

    const classStudents = students.filter((s) => s.className === selectedClass);
    const subjectList = Array.from(
      new Set(examsForClass.map((e) => e.subject || e.examName || "Subject"))
    );

    const rows = classStudents.map((stu) => {
      const studentResults = results.filter(
        (r) => r.studentId === (stu.studentId || stu.id)
      );

      let totalMarks = 0;
      let totalMax = 0;
      const bySubject = {};

      subjectList.forEach((subj) => {
        const match = studentResults.find((r) => (r.subject || r.examName) === subj);
        if (match) {
          const marks = Number(match.marks) || 0;
          const maxMarks = Number(match.maxMarks) || 0;
          bySubject[subj] = { marks, maxMarks };
          totalMarks += marks;
          totalMax += maxMarks;
        } else {
          bySubject[subj] = null;
        }
      });

      const average = totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0;

      return {
        studentId: stu.studentId || stu.id,
        fullName: stu.fullName || stu.name || "—",
        bySubject,
        totalMarks,
        totalMax,
        average,
      };
    });

    return { subjects: subjectList, rows };
  }, [selectedClass, students, examsForClass, results]);

  function exportCSV() {
    if (!selectedClass || gradebook.rows.length === 0) return;

    const headers = ["Student Name", ...gradebook.subjects, "Total", "Average %"];
    const lines = [headers.join(",")];

    gradebook.rows.forEach((row) => {
      const cells = [
        `"${row.fullName}"`,
        ...gradebook.subjects.map((subj) => {
          const cell = row.bySubject[subj];
          return cell ? cell.marks : "";
        }),
        `${row.totalMarks}/${row.totalMax}`,
        `${row.average}%`,
      ];
      lines.push(cells.join(","));
    });

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Class-${selectedClass}-Results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F3F4F8", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ padding: "22px 26px 0" }}>
          <Topbar />
        </div>

        <div style={{ padding: "26px 30px" }}>
          <h1 style={{ margin: "0 0 22px", fontSize: 22, fontWeight: 800, color: "#111827" }}>
            Exams
          </h1>

          {loading && (
            <div style={{ ...cardStyle, textAlign: "center", color: "#9CA3AF" }}>
              Xogta ayaa la soo qaadayaa...
            </div>
          )}

          {!loading && !selectedClass && (
            <>
              <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
                Dooro fasal si aad u aragto imtixaanada iyo natiijooyinka ardayda.
              </p>

              {classes.length === 0 ? (
                <div style={{ ...cardStyle, textAlign: "center", color: "#9CA3AF" }}>
                  Fasallo iyo imtixaano lama helin.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 18,
                  }}
                >
                  {classes.map((cls) => {
                    const examCount = exams.filter((e) => e.className === cls).length;
                    const studentCount = students.filter((s) => s.className === cls).length;
                    return (
                      <button
                        key={cls}
                        onClick={() => setSelectedClass(cls)}
                        style={{
                          ...cardStyle,
                          textAlign: "left",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                          border: "1px solid rgba(22,163,74,0.15)",
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: "#E6F5EC",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                          }}
                        >
                          📘
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>
                            Class {cls}
                          </div>
                          <div style={{ fontSize: 12.5, color: "#9CA3AF", marginTop: 2 }}>
                            {examCount} exam{examCount !== 1 ? "s" : ""} · {studentCount} student
                            {studentCount !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: "#16a34a",
                          }}
                        >
                          View results <ChevronRight size={14} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {!loading && selectedClass && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <button
                  onClick={() => setSelectedClass(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "transparent",
                    border: "none",
                    color: "#16a34a",
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <ChevronLeft size={16} /> All Classes
                </button>

                <button
                  onClick={exportCSV}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    borderRadius: 12,
                    border: "none",
                    background: "#16a34a",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <Download size={15} />
                  Export to Excel (CSV)
                </button>
              </div>

              <div style={{ ...cardStyle, marginBottom: 20 }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
                  Class {selectedClass} — Exams
                </h3>
                {examsForClass.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#9CA3AF" }}>Imtixaano lama helin fasalkan.</p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {examsForClass.map((e) => (
                      <span
                        key={e.id}
                        style={{
                          background: "#F3F4F6",
                          padding: "8px 14px",
                          borderRadius: 20,
                          fontSize: 12.5,
                          color: "#374151",
                          fontWeight: 600,
                        }}
                      >
                        {e.examName || e.subject} · {e.subject || "—"} · Max {e.maxMarks || "—"}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ ...cardStyle, overflowX: "auto" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
                  Class {selectedClass} — Results (Excel-style Gradebook)
                </h3>

                {gradebook.rows.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#9CA3AF" }}>Ardayda fasalkan lama helin.</p>
                ) : (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 13,
                      minWidth: 560 + gradebook.subjects.length * 110,
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={thStyle}>Student Name</th>
                        {gradebook.subjects.map((subj) => (
                          <th key={subj} style={thStyle}>
                            {subj}
                          </th>
                        ))}
                        <th style={thStyle}>Total</th>
                        <th style={thStyle}>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradebook.rows.map((row, idx) => (
                        <tr
                          key={row.studentId}
                          style={{
                            background: idx % 2 === 0 ? "#fff" : "#FAFBFC",
                          }}
                        >
                          <td style={{ ...tdStyle, fontWeight: 700, color: "#111827", position: "sticky", left: 0, background: idx % 2 === 0 ? "#fff" : "#FAFBFC" }}>
                            {row.fullName}
                          </td>
                          {gradebook.subjects.map((subj) => {
                            const cell = row.bySubject[subj];
                            return (
                              <td key={subj} style={tdStyle}>
                                {cell ? `${cell.marks}/${cell.maxMarks}` : "—"}
                              </td>
                            );
                          })}
                          <td style={{ ...tdStyle, fontWeight: 700 }}>
                            {row.totalMarks}/{row.totalMax}
                          </td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                background: row.average >= 50 ? "#DCFCE7" : "#FEE2E2",
                                color: row.average >= 50 ? "#16A34A" : "#DC2626",
                                fontSize: 12,
                                fontWeight: 700,
                                padding: "4px 12px",
                                borderRadius: 20,
                              }}
                            >
                              {row.average}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  fontWeight: 700,
  fontSize: 12,
  color: "#6B7280",
  padding: "10px 14px",
  borderBottom: "2px solid #E5E7EB",
  whiteSpace: "nowrap",
  background: "#F9FAFB",
};

const tdStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid #F3F4F6",
  color: "#374151",
  whiteSpace: "nowrap",
};