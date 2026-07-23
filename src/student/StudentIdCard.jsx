// src/student/StudentIdCard.jsx
//
// Renders the official Rising Star Primary & Secondary School Student ID
// card — front + back — matching the printed reference design exactly.
// All data (fullName, studentId, className, shift, studentPhoto, issueDate,
// expireDate) is pulled from the student's own Firestore record — nothing
// is hardcoded except the fixed school branding text.
//
// Includes:
//   - "Print ID Card" button (prints front + back, CR80 card size)
//   - "Download ID Card" button (downloads front + back as PNG images,
//     using html2canvas — no server round-trip needed)

import { useRef, useState } from "react";

const SCHOOL = {
  name1: "RISING STAR",
  name2: "PRIMARY & SECONDARY SCHOOL",
  since: "Since 2024",
  tagline: "Education is life it self.",
  noticeTitle: "NB",
  noticeBody: "If you accidently find this card, please contact the following address.",
  noticeTell: "+252-61 7390261",
  noticeEmail: "risingstar0261@gmail.com",
  noticeWeb: "resingstarschools.com",
  officeLabel: "Admission & Student Affairs Office",
};

function formatDate(d) {
  if (!d) return null;
  const dateObj = d?.seconds ? new Date(d.seconds * 1000) : new Date(d);
  if (isNaN(dateObj.getTime())) return null;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const months = [
    "JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC",
  ];
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return { day, month, year, str: `${day} ${month} ${year}` };
}

function addYears(dateObj, years) {
  const d = new Date(dateObj.getTime());
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function CardStyles() {
  return (
    <style>{`
      .idc-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 28px;
        justify-content: center;
        padding: 24px 0;
      }

      .idc-card {
        width: 420px;
        max-width: 100%;
        aspect-ratio: 856 / 540;
        border-radius: 14px;
        overflow: hidden;
        position: relative;
        background: #ffffff;
        box-shadow: 0 18px 44px rgba(0,0,0,0.28);
        font-family: 'Poppins','Inter','Segoe UI',system-ui,sans-serif;
      }

      /* ---------- FRONT ---------- */
      .idc-front {
        display: flex;
        flex-direction: column;
        padding: 14px 20px 0;
      }

      .idc-stars {
        text-align: center;
        color: #e08b1d;
        font-size: 13px;
        letter-spacing: 6px;
        margin-bottom: 2px;
      }

      .idc-front-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
      }

      .idc-seal {
        width: 62px;
        height: 62px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid #14532d;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 6.5px;
        font-weight: 800;
        color: #14532d;
        text-align: center;
        line-height: 1.15;
        padding: 3px;
      }

      .idc-school-block { text-align: center; line-height: 1.15; }
      .idc-school-name1 {
        font-size: 26px;
        font-weight: 800;
        color: #14532d;
        letter-spacing: 1px;
      }
      .idc-school-name2 {
        font-size: 11.5px;
        font-weight: 700;
        color: #16202b;
        letter-spacing: 2.5px;
        border-top: 2px solid #e08b1d;
        display: inline-block;
        padding-top: 2px;
        margin-top: 2px;
      }
      .idc-school-tag {
        font-size: 10px;
        font-weight: 600;
        font-style: italic;
        color: #16202b;
        margin-top: 4px;
        text-align: center;
      }

      .idc-front-body {
        flex: 1;
        display: flex;
        padding: 12px 0 0;
        gap: 12px;
      }

      .idc-fields {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 12px;
        min-width: 0;
      }
      .idc-field-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
      }
      .idc-field-icon {
        width: 22px;
        height: 22px;
        border-radius: 6px;
        background: #14532d;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        flex-shrink: 0;
      }
      .idc-field-label {
        font-weight: 800;
        color: #16202b;
        min-width: 88px;
        letter-spacing: 0.3px;
        white-space: nowrap;
      }
      .idc-field-colon { color: #16202b; font-weight: 700; }
      .idc-field-value {
        font-weight: 800;
        color: #16202b;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .idc-photo-wrap {
        width: 118px;
        flex-shrink: 0;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 4px;
      }
      .idc-photo {
        width: 112px;
        height: 130px;
        object-fit: cover;
        border-radius: 8px;
        border: 3px solid #f5a623;
        background: #eef3ee;
      }
      .idc-photo-placeholder {
        width: 112px;
        height: 130px;
        border-radius: 8px;
        border: 2px dashed #9db8a4;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #6b8a73;
        text-align: center;
        padding: 4px;
      }

      .idc-front-footer {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 4px 12px;
        gap: 10px;
        position: relative;
        z-index: 2;
      }
      .idc-date-block { font-size: 9px; }
      .idc-date-label {
        font-weight: 800;
        color: #e08b1d;
        letter-spacing: 0.5px;
      }
      .idc-date-value {
        font-weight: 800;
        color: #16202b;
        font-size: 11px;
        margin-top: 1px;
      }
      .idc-date-id {
        font-weight: 700;
        color: #16202b;
        font-size: 9px;
        margin-top: 2px;
      }

      .idc-front-wave {
        height: 34px;
        position: relative;
        z-index: 1;
      }
      .idc-front-wave svg { width: 100%; height: 100%; display: block; }

      /* ---------- BACK ---------- */
      .idc-back {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        color: #16202b;
        text-align: center;
      }
      .idc-back-wave-top, .idc-back-wave-bottom {
        position: relative;
        z-index: 1;
        height: 30px;
        overflow: hidden;
      }
      .idc-back-wave-top svg, .idc-back-wave-bottom svg {
        width: 100%; height: 100%; display: block;
      }

      .idc-back-content {
        position: relative;
        z-index: 2;
        padding: 28px 34px 0;
        flex: 1;
      }
      .idc-back-title {
        font-size: 30px;
        font-weight: 800;
        color: #14532d;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }
      .idc-back-title .idc-diamond {
        color: #e08b1d;
        font-size: 12px;
      }
      .idc-back-title .idc-line {
        flex: 1;
        max-width: 60px;
        height: 2px;
        background: #e08b1d;
      }
      .idc-back-notice {
        font-size: 13.5px;
        font-weight: 700;
        color: #c0392b;
        line-height: 1.5;
        max-width: 330px;
        margin: 0 auto 16px;
      }
      .idc-back-line {
        font-size: 13.5px;
        font-weight: 700;
        margin: 6px 0;
        color: #16202b;
      }
      .idc-back-line b { color: #14532d; }

      .idc-back-footer-wrap {
        position: relative;
        z-index: 2;
        background: #14532d;
        padding: 10px 12px 12px;
      }
      .idc-back-footer {
        font-size: 13px;
        font-weight: 800;
        color: #fff;
        letter-spacing: 0.3px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      .idc-back-footer .idc-diamond { color: #e08b1d; font-size: 10px; }

      .idc-actions {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 4px;
        flex-wrap: wrap;
      }
      .idc-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
        border-radius: 10px;
        padding: 11px 24px;
        font-weight: 700;
        font-size: 13.5px;
        cursor: pointer;
      }
      .idc-btn:disabled { opacity: 0.6; cursor: default; }
      .idc-btn-print {
        background: #14532d;
        color: #fff;
        box-shadow: 0 10px 24px rgba(20,83,45,0.3);
      }
      .idc-btn-download {
        background: #e08b1d;
        color: #fff;
        box-shadow: 0 10px 24px rgba(224,139,29,0.3);
      }

      @media print {
        body { margin: 0; }
        .idc-print-hide { display: none !important; }
        .idc-wrap { gap: 0; padding: 0; }
        .idc-card { box-shadow: none; page-break-inside: avoid; }
      }
    `}</style>
  );
}

function FrontWave() {
  return (
    <svg viewBox="0 0 420 40" preserveAspectRatio="none">
      <path d="M0,40 H420 V16 C330,2 300,26 230,18 C160,10 120,30 60,20 C30,15 15,22 0,18 Z" fill="#14532d" />
      <path d="M0,40 H420 V26 C330,14 300,32 230,26 C160,20 120,34 60,28 C30,25 15,29 0,27 Z" fill="#e08b1d" opacity="0.85" />
    </svg>
  );
}

function BackWaveTop() {
  return (
    <svg viewBox="0 0 420 30" preserveAspectRatio="none">
      <path d="M0,0 H420 V10 C320,24 260,4 180,14 C100,24 60,8 0,16 Z" fill="#14532d" />
      <path d="M0,0 H420 V6 C330,16 270,2 190,8 C110,14 60,4 0,10 Z" fill="#e08b1d" opacity="0.85" />
    </svg>
  );
}

function BackWaveBottom() {
  return (
    <svg viewBox="0 0 420 30" preserveAspectRatio="none">
      <path d="M0,30 H420 V20 C320,6 260,26 180,16 C100,6 60,22 0,14 Z" fill="#e08b1d" opacity="0.85" />
      <path d="M0,30 H420 V24 C320,12 260,30 180,22 C100,14 60,28 0,20 Z" fill="#14532d" />
    </svg>
  );
}

function CardFront({ student, studentId, forwardRef }) {
  const shift = student?.shift || student?.classShift || "MORNING";
  const issued = formatDate(student?.createdAt) || formatDate(new Date());
  const issuedDateObj = student?.createdAt
    ? (student.createdAt?.seconds
        ? new Date(student.createdAt.seconds * 1000)
        : new Date(student.createdAt))
    : new Date();
  const expire = student?.expireDate
    ? formatDate(student.expireDate)
    : formatDate(addYears(issuedDateObj, 1));

  return (
    <div className="idc-card idc-front" ref={forwardRef}>
      <div className="idc-stars">★ ★ ★ ★ ★</div>

      <div className="idc-front-header">
        <div className="idc-seal">RISING STAR<br />PRIMARY &amp;<br />SECONDARY<br />SCHOOL</div>
        <div className="idc-school-block">
          <div className="idc-school-name1">{SCHOOL.name1}</div>
          <div className="idc-school-name2">{SCHOOL.name2}</div>
        </div>
      </div>
      <div className="idc-school-tag">{SCHOOL.tagline}</div>

      <div className="idc-front-body">
        <div className="idc-fields">
          <div className="idc-field-row">
            <span className="idc-field-icon">ID</span>
            <span className="idc-field-label">STUDENT ID</span>
            <span className="idc-field-colon">:</span>
            <span className="idc-field-value">{studentId || "—"}</span>
          </div>
          <div className="idc-field-row">
            <span className="idc-field-icon">👤</span>
            <span className="idc-field-label">STUDENT NAME</span>
            <span className="idc-field-colon">:</span>
            <span className="idc-field-value">{(student?.fullName || "—").toUpperCase()}</span>
          </div>
          <div className="idc-field-row">
            <span className="idc-field-icon">🎓</span>
            <span className="idc-field-label">CLASS</span>
            <span className="idc-field-colon">:</span>
            <span className="idc-field-value">{student?.className || "—"}</span>
          </div>
          <div className="idc-field-row">
            <span className="idc-field-icon">🕒</span>
            <span className="idc-field-label">SHIFT</span>
            <span className="idc-field-colon">:</span>
            <span className="idc-field-value">{String(shift).toUpperCase()}</span>
          </div>
        </div>

        <div className="idc-photo-wrap">
          {student?.studentPhoto ? (
            <img
              className="idc-photo"
              src={student.studentPhoto}
              alt={student.fullName || "Student"}
              crossOrigin="anonymous"
            />
          ) : (
            <div className="idc-photo-placeholder">No Photo</div>
          )}
        </div>
      </div>

      <div className="idc-front-footer">
        <div className="idc-date-block">
          <div className="idc-date-label">ISSUE DATE</div>
          <div className="idc-date-value">{issued?.str || "—"}</div>
        </div>
        <div className="idc-date-block" style={{ textAlign: "right" }}>
          <div className="idc-date-label">EXPIRE DATE</div>
          <div className="idc-date-value">{expire?.str || "—"}</div>
          <div className="idc-date-id">{studentId || "—"}</div>
        </div>
      </div>

      <div className="idc-front-wave">
        <FrontWave />
      </div>
    </div>
  );
}

function CardBack({ forwardRef }) {
  return (
    <div className="idc-card idc-back" ref={forwardRef}>
      <div className="idc-back-wave-top"><BackWaveTop /></div>

      <div className="idc-back-content">
        <div className="idc-back-title">
          <span className="idc-line" />
          <span className="idc-diamond">◆</span>
          NB
          <span className="idc-diamond">◆</span>
          <span className="idc-line" />
        </div>
        <div className="idc-back-notice">{SCHOOL.noticeBody}</div>
        <div className="idc-back-line"><b>Tell:</b> {SCHOOL.noticeTell}</div>
        <div className="idc-back-line"><b>Email:</b> {SCHOOL.noticeEmail}</div>
        <div className="idc-back-line"><b>Web:</b> {SCHOOL.noticeWeb}</div>
      </div>

      <div className="idc-back-wave-bottom"><BackWaveBottom /></div>
      <div className="idc-back-footer-wrap">
        <div className="idc-back-footer">
          <span className="idc-diamond">◆</span>
          {SCHOOL.officeLabel}
          <span className="idc-diamond">◆</span>
        </div>
      </div>
    </div>
  );
}

// Loads html2canvas from CDN once and caches the promise on window.
function loadHtml2Canvas() {
  if (window.__html2canvasPromise) return window.__html2canvasPromise;
  window.__html2canvasPromise = new Promise((resolve, reject) => {
    if (window.html2canvas) {
      resolve(window.html2canvas);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.onload = () => resolve(window.html2canvas);
    script.onerror = () => reject(new Error("Failed to load html2canvas"));
    document.body.appendChild(script);
  });
  return window.__html2canvasPromise;
}

export default function StudentIdCard({ student, studentId }) {
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=650");
    if (!printWindow) return;

    const frontHtml = frontRef.current?.outerHTML || "";
    const backHtml = backRef.current?.outerHTML || "";
    const stylesHtml = Array.from(document.querySelectorAll("style"))
      .map((s) => s.outerHTML)
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student ID Card - ${student?.fullName || studentId}</title>
          <meta charset="utf-8" />
          ${stylesHtml}
          <style>
            body { margin: 0; padding: 24px; display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; background: #eee; font-family: sans-serif; }
            .idc-card { box-shadow: 0 4px 14px rgba(0,0,0,0.2); }
          </style>
        </head>
        <body>
          ${frontHtml}
          ${backHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const handleDownload = async () => {
    setError("");
    setBusy(true);
    try {
      const html2canvas = await loadHtml2Canvas();
      const namePart = (student?.fullName || studentId || "student")
        .toString()
        .trim()
        .replace(/\s+/g, "_");

      const renderAndSave = async (node, suffix) => {
        if (!node) return;
        const canvas = await html2canvas(node, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const link = document.createElement("a");
        link.download = `${namePart}_ID_${suffix}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };

      await renderAndSave(frontRef.current, "front");
      await renderAndSave(backRef.current, "back");
    } catch (err) {
      console.error(err);
      setError("Download failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <CardStyles />

      <div className="idc-wrap">
        <CardFront student={student} studentId={studentId} forwardRef={frontRef} />
        <CardBack forwardRef={backRef} />
      </div>

      <div className="idc-print-hide idc-actions">
        <button className="idc-btn idc-btn-print" onClick={handlePrint}>
          🖨️ Print ID card
        </button>
        <button className="idc-btn idc-btn-download" onClick={handleDownload} disabled={busy}>
          {busy ? "Preparing…" : "⬇️ Download ID card"}
        </button>
      </div>

      {error && (
        <div style={{ textAlign: "center", fontSize: 12, color: "#c0392b", marginTop: 8 }}>
          {error}
        </div>
      )}
    </div>
  );
}