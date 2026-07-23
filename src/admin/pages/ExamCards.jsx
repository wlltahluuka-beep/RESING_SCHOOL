import { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { IdCard, Printer, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const SCHOOL_NAME_EN = "RISING STAR PRIMARY & SECONDARY SCHOOL";
const SCHOOL_NAME_AR = "مدرسة ريسن استار الأساسية والثانوية";

const CLASS_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "F1", "F2", "F3", "F4"];
function classRank(c) {
  const i = CLASS_ORDER.indexOf(String(c || "").toUpperCase());
  return i === -1 ? 999 : i;
}

const EXAM_TYPES = [
  { key: "monthly1", label: "Monthly 1" },
  { key: "midterm", label: "Mid Term" },
  { key: "monthly2", label: "Monthly 2" },
  { key: "final", label: "Final" },
];

function pad4(n) {
  return String(n).padStart(4, "0");
}

function formatDate(ts) {
  if (!ts?.seconds) return new Date().toLocaleDateString("en-GB");
  return new Date(ts.seconds * 1000).toLocaleDateString("en-GB");
}

function ExamCardStyles() {
  return (
    <style>{`
      .ec-layout { display: flex; min-height: 100vh; background: #0b0a1c; }
      .ec-content { flex: 1; min-width: 0; }
      .ec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(560px, 1fr)); gap: 20px; }
      @media print {
        body * { visibility: hidden; }
        .ec-print-area, .ec-print-area * { visibility: visible; }
        .ec-print-area { position: absolute; top: 0; left: 0; width: 100%; }
        .ec-card { break-inside: avoid; page-break-inside: avoid; margin-bottom: 14px !important; box-shadow: none !important; }
      }
      @media (max-width: 900px) {
        .ec-page-pad { padding: 16px !important; }
        .ec-grid { grid-template-columns: 1fr; }
        .ec-toolbar { flex-direction: column; align-items: stretch !important; }
      }
    `}</style>
  );
}

function ExamCard({ card }) {
  const examLabel = EXAM_TYPES.find((t) => t.key === card.examType)?.label || "Final";
  return (
    <div
      className="ec-card"
      style={{
        background: "repeating-linear-gradient(135deg, #FBF4C9 0 40px, #FAF1BE 40px 80px)",
        border: "10px solid transparent",
        borderImage: "repeating-linear-gradient(45deg,#5c3a21 0 6px,#7a4e2a 6px 12px) 12",
        borderRadius: 4,
        padding: "18px 24px",
        position: "relative",
        color: "#1a1a1a",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <div style={{ border: "2px solid #6b3f1d", borderRadius: 2, padding: "16px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 17, color: "#0f5132", letterSpacing: 0.3 }}>
            {SCHOOL_NAME_EN}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0f5132" }}>{SCHOOL_NAME_AR}</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "8px 0 10px",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div
            style={{
              border: "1.5px solid #0f5132",
              color: "#0f5132",
              fontWeight: 800,
              fontSize: 18,
              padding: "3px 14px",
              borderRadius: 2,
            }}
          >
            EXAM CARD
          </div>
          <div style={{ fontSize: 13 }}>
            <div>
              DATE: <strong>{formatDate(card.createdAt)}</strong>
            </div>
            <div>
              CARD NO: <strong>{pad4(card.cardNo)}</strong>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 14, marginBottom: 6 }}>
          NAME OF STUDENT: <strong>{card.studentName}</strong>
        </div>
        <div style={{ fontSize: 14, marginBottom: 10, display: "flex", gap: 24 }}>
          <span>
            CLASS: <strong>{card.className}</strong>
          </span>
          <span>
            ROLL NO: <strong>{card.studentId}</strong>
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 4 }}>
          {EXAM_TYPES.map((t) => (
            <label
              key={t.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                color: "#0f5132",
                fontSize: 13.5,
              }}
            >
              <span
                style={{
                  width: 15,
                  height: 15,
                  border: "1.5px solid #1a1a1a",
                  display: "inline-block",
                  background: t.label === examLabel ? "#0f5132" : "transparent",
                }}
              />
              {t.label}
            </label>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <div style={{ textAlign: "center", minWidth: 180 }}>
            <div style={{ height: 32 }} />
            <div
              style={{
                borderTop: "1.5px solid #1a1a1a",
                paddingTop: 4,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Principal's Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExamCards() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  // ---- Kaliya soo aqri examCards collection-ka — waxaa ka buuxiya
  // Cashierka marka uu arday lacagta imtixaanka ka qaado (ExamPayments
  // page-ka). Admin-ku halkan wuxuu daawadaa oo daabici karaa kaliya,
  // ma sameeynayo card cusub. ----
  async function load() {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "examCards"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCards(data);
    } catch (err) {
      console.log(err);
      alert("Khalad ayaa dhacay marka Exam Cards la soo qaadanayay: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const classes = useMemo(() => {
    const set = new Set(cards.map((c) => c.className).filter(Boolean));
    return [...set].sort((a, b) => classRank(a) - classRank(b));
  }, [cards]);

  const cardsForClass = useMemo(() => {
    if (!selectedClass) return [];
    return cards
      .filter((c) => String(c.className).toUpperCase() === String(selectedClass).toUpperCase())
      .filter((c) => {
        const t = search.toLowerCase();
        return (
          !t ||
          (c.studentName || "").toLowerCase().includes(t) ||
          String(c.studentId).toLowerCase().includes(t)
        );
      })
      .sort((a, b) => (a.studentName || "").localeCompare(b.studentName || ""));
  }, [cards, selectedClass, search]);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="ec-layout">
      <ExamCardStyles />
      <Sidebar />

      <div className="ec-content">
        <div style={{ padding: "20px 24px 0" }}>
          <Topbar />
        </div>

        <div className="ec-page-pad" style={{ padding: "26px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div
              style={{
                width: 55,
                height: 55,
                borderRadius: 15,
                background: "linear-gradient(135deg,#6d5df0,#8b6cf5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IdCard color="#fff" size={26} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, color: "#fff" }}>Exam Cards</h1>
              <div style={{ color: "#8b87ad", fontSize: 14 }}>
                Exam Cards ardayda cashierku u sameeyay marka lacagta imtixaanka la bixiyay
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ color: "#8b87ad", textAlign: "center", padding: 60 }}>
              Xogta ayaa la soo qaadayaa...
            </div>
          ) : cards.length === 0 ? (
            <div style={{ color: "#8b87ad", textAlign: "center", padding: 60 }}>
              Weli Exam Card lama sameyn. Marka cashierku uu ka qaado lacagta imtixaanka
              ardayda, cardadku halkan ayay ku soo muuqan doonaan.
            </div>
          ) : !selectedClass ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {classes.map((cls) => {
                const count = cards.filter(
                  (c) => String(c.className).toUpperCase() === cls.toUpperCase()
                ).length;
                return (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    style={{
                      background: "linear-gradient(160deg,#151233,#181341)",
                      border: "1px solid rgba(139,108,245,0.25)",
                      borderRadius: 18,
                      padding: "20px",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#fff",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Fasalka: {cls}</div>
                    <div style={{ color: "#8b87ad", fontSize: 12.5, marginTop: 4 }}>
                      {count} card oo la sameeyay
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <div
                className="ec-toolbar"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 18,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => setSelectedClass(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#8B5CF6",
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: "pointer",
                  }}
                >
                  ← Dhamaan Fasallada
                </button>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative" }}>
                    <Search
                      size={14}
                      color="#8b87ad"
                      style={{ position: "absolute", left: 10, top: 10 }}
                    />
                    <input
                      placeholder="Raadi arday..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(139,108,245,0.3)",
                        color: "#e5e3f7",
                        borderRadius: 10,
                        padding: "9px 12px 9px 30px",
                        fontSize: 13,
                        width: 180,
                      }}
                    />
                  </div>

                  <button
                    onClick={handlePrint}
                    disabled={cardsForClass.length === 0}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 18px",
                      borderRadius: 12,
                      border: "none",
                      background: "linear-gradient(135deg,#6d5df0,#8b6cf5)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <Printer size={15} />
                    Daabac Dhammaan
                  </button>
                </div>
              </div>

              <div style={{ color: "#c4b8f7", fontSize: 13, marginBottom: 16 }}>
                Fasalka <strong style={{ color: "#fff" }}>{selectedClass}</strong> —{" "}
                {cardsForClass.length} card
              </div>

              {cardsForClass.length === 0 ? (
                <div style={{ color: "#8b87ad", padding: 30, textAlign: "center" }}>
                  Cardad lama helin fasalkan/raadintan.
                </div>
              ) : (
                <div className="ec-print-area">
                  <div className="ec-grid">
                    {cardsForClass.map((c) => (
                      <ExamCard key={c.id} card={c} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}