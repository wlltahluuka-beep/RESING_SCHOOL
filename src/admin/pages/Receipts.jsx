// src/admin/pages/Receipts.jsx
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Search, Printer, X, Receipt as ReceiptIcon } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const SCHOOL_NAME = "Rising School";

function formatDate(value) {
  if (!value) return "—";
  const d = value?.seconds ? new Date(value.seconds * 1000) : new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const cardStyle = {
  background: "#fff",
  borderRadius: 18,
  boxShadow: "0 4px 18px rgba(17,24,39,0.06)",
  border: "1px solid rgba(17,24,39,0.05)",
};

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchReceipts();
  }, []);

  async function fetchReceipts() {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "receipts"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Ugu horeeya rasiidka ugu dambeeyay (lambar ugu weyn ama createdAt
      // ugu dambeeyay).
      list.sort((a, b) => {
        const at = a.createdAt?.seconds || 0;
        const bt = b.createdAt?.seconds || 0;
        if (bt !== at) return bt - at;
        return String(b.receiptNo).localeCompare(String(a.receiptNo));
      });
      setReceipts(list);
    } catch (err) {
      console.error("Khalad ayaa dhacay markii rasiidhada la soo qaadanayay:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return receipts;
    return receipts.filter((r) => {
      return (
        String(r.receiptNo || "").toLowerCase().includes(q) ||
        String(r.studentName || "").toLowerCase().includes(q) ||
        String(r.className || "").toLowerCase().includes(q) ||
        String(r.monthLabel || "").toLowerCase().includes(q)
      );
    });
  }, [receipts, query]);

  const totalCollected = useMemo(
    () => filtered.reduce((sum, r) => sum + (Number(r.paidAmount) || 0), 0),
    [filtered]
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F3F4F8",
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ padding: "22px 26px 0" }}>
          <Topbar />
        </div>

        <div style={{ padding: "26px 30px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
              marginBottom: 22,
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#111827" }}>
                Receipts
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#6B7280" }}>
                Dhammaan rasiidhada lacagaha ee laga bixiyay {SCHOOL_NAME}
              </p>
            </div>

            <div
              style={{
                ...cardStyle,
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#E6F5EC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ReceiptIcon size={19} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>
                  {query ? "Natiijooyinka" : "Wadarta"} Rasiidhada
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                  {filtered.length}
                </div>
              </div>
              <div style={{ width: 1, height: 30, background: "#F3F4F6" }} />
              <div>
                <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>Wadarta Lacagta</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#16a34a" }}>
                  ${totalCollected.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{ ...cardStyle, padding: "14px 18px", marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#F9FAFB",
                border: "1px solid #F3F4F6",
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              <Search size={16} color="#9CA3AF" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Raadi lambarka rasiidka, magaca ardayga, fasalka, ama bisha..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  flex: 1,
                  fontSize: 13.5,
                  color: "#111827",
                }}
              />
              {query && (
                <X
                  size={16}
                  color="#9CA3AF"
                  style={{ cursor: "pointer" }}
                  onClick={() => setQuery("")}
                />
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ ...cardStyle, padding: "20px 22px", overflowX: "auto" }}>
            {loading && (
              <p style={{ fontSize: 13, color: "#9CA3AF", padding: "20px 0", textAlign: "center" }}>
                Soo dejinaya rasiidhada...
              </p>
            )}

            {!loading && filtered.length === 0 && (
              <p style={{ fontSize: 13, color: "#9CA3AF", padding: "20px 0", textAlign: "center" }}>
                {query ? "Wax rasiid ah oo la mid ah lama helin." : "Rasiid lama helin weli."}
              </p>
            )}

            {!loading && filtered.length > 0 && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640 }}>
                <thead>
                  <tr style={{ color: "#9CA3AF", textAlign: "left" }}>
                    <th style={{ fontWeight: 600, paddingBottom: 10 }}>No</th>
                    <th style={{ fontWeight: 600, paddingBottom: 10 }}>Student</th>
                    <th style={{ fontWeight: 600, paddingBottom: 10 }}>Class</th>
                    <th style={{ fontWeight: 600, paddingBottom: 10 }}>Month</th>
                    <th style={{ fontWeight: 600, paddingBottom: 10 }}>Date</th>
                    <th style={{ fontWeight: 600, paddingBottom: 10 }}>Amount</th>
                    <th style={{ fontWeight: 600, paddingBottom: 10 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "10px 0", fontWeight: 700, color: "#111827" }}>
                        {r.receiptNo}
                      </td>
                      <td style={{ color: "#111827", fontWeight: 600 }}>{r.studentName || "—"}</td>
                      <td style={{ color: "#6B7280" }}>{r.className || "—"}</td>
                      <td style={{ color: "#6B7280" }}>{r.monthLabel || "—"}</td>
                      <td style={{ color: "#6B7280" }}>{formatDate(r.paidAt || r.createdAt)}</td>
                      <td style={{ color: "#16a34a", fontWeight: 700 }}>
                        ${Number(r.paidAmount || 0).toLocaleString()}
                      </td>
                      <td>
                        <button
                          onClick={() => setSelected(r)}
                          style={{
                            border: "none",
                            background: "#E6F5EC",
                            color: "#16a34a",
                            fontWeight: 700,
                            fontSize: 12,
                            padding: "6px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <ReceiptViewModal receipt={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

// Modal fudud oo u shaqeeya sida ReceiptModal.jsx, laakiin ka soo akhriya
// xog rasiid oo hore loo kaydiyay (halkii uu ka kordhin lahaa lambar cusub).
function ReceiptViewModal({ receipt, onClose }) {
  return (
    <>
      <div className="rv-overlay">
        <div className="rv-actions no-print">
          <button onClick={onClose} className="rv-close-btn">
            Xir
          </button>
          <button onClick={() => window.print()} className="rv-print-btn">
            <Printer size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
            Print
          </button>
        </div>

        <div className="rv-paper">
          <div className="rv-header">
            <div className="rv-school">{SCHOOL_NAME}</div>
            <div className="rv-sub">Payment Receipt</div>
          </div>

          <div className="rv-line" />

          <div className="rv-row">
            <span>No:</span>
            <span className="rv-strong">{receipt.receiptNo}</span>
          </div>
          <div className="rv-row">
            <span>Date:</span>
            <span>{formatDate(receipt.paidAt || receipt.createdAt)}</span>
          </div>
          <div className="rv-row">
            <span>Academic Year:</span>
            <span>{receipt.academicYear || "—"}</span>
          </div>

          <div className="rv-line" />

          <div className="rv-row">
            <span>Student:</span>
            <span className="rv-strong">{receipt.studentName || "—"}</span>
          </div>
          <div className="rv-row">
            <span>Class:</span>
            <span>{receipt.className || "—"}</span>
          </div>
          <div className="rv-row">
            <span>Month:</span>
            <span>{receipt.monthLabel || "—"}</span>
          </div>

          <div className="rv-line" />

          <div className="rv-row rv-amount">
            <span>Amount Paid:</span>
            <span className="rv-strong">${Number(receipt.paidAmount || 0)}</span>
          </div>

          <div className="rv-line" />

          <div className="rv-footer">Mahadsanid!</div>
        </div>
      </div>

      <style>{`
        .rv-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          gap: 14px;
        }
        .rv-actions { display: flex; gap: 10px; }
        .rv-close-btn, .rv-print-btn {
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }
        .rv-close-btn {
          background: #ffffff;
          color: #6B7280;
          border: 1px solid #E5E7EB;
        }
        .rv-print-btn {
          background: #16a34a;
          color: #ffffff;
        }
        .rv-paper {
          width: 302px;
          background: #ffffff;
          padding: 18px 16px;
          font-family: 'Courier New', monospace;
          color: #111827;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }
        .rv-header { text-align: center; margin-bottom: 10px; }
        .rv-school { font-weight: 800; font-size: 15px; letter-spacing: 0.5px; }
        .rv-sub { font-size: 11px; color: #6B7280; margin-top: 2px; }
        .rv-line { border-top: 1px dashed #9CA3AF; margin: 8px 0; }
        .rv-row { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 4px; }
        .rv-strong { font-weight: 700; }
        .rv-amount { font-size: 14px; }
        .rv-footer { text-align: center; font-size: 12px; margin-top: 10px; font-weight: 700; }

        @media print {
          body * { visibility: hidden; }
          .rv-paper, .rv-paper * { visibility: visible; }
          .rv-paper {
            position: absolute; top: 0; left: 0;
            box-shadow: none; width: 80mm;
          }
          .no-print { display: none !important; }
          @page { size: 80mm auto; margin: 0; }
        }
      `}</style>
    </>
  );
}