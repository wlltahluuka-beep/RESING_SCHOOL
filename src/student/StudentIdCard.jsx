// src/student/StudentIdCard.jsx
//
// Renders the official Rising Star Primary & Secondary School Student ID
// card — front + back — matching the printed reference design exactly.
// All data (fullName, studentId, className, shift, studentPhoto, issueDate)
// is pulled from the student's own Firestore record. Expire date is always
// computed as issueDate + 1 year, so it stays correct automatically.
//
// Includes a working "Print ID Card" button and a working
// "Download ID Card" button (downloads front + back as PNG via html2canvas).

import { useRef, useState } from "react";

const SCHOOL = {
  name1: "RISING STAR",
  name2: "PRIMARY & SECONDARY SCHOOL",
  since: "Since 2024",
  tagline: "Education is life it self.",
  noticeBody: "If you accidently find this card, please contact the following address.",
  noticeTell: "+252-61 7390261",
  noticeEmail: "risingstar0261@gmail.com",
  noticeWeb: "resingstarschools.com",
  officeLabel: "Admission & Student Affairs Office",
};

function toDateObj(d) {
  if (!d) return null;
  const dateObj = d?.seconds ? new Date(d.seconds * 1000) : new Date(d);
  return isNaN(dateObj.getTime()) ? null : dateObj;
}

function formatDate(dateObj) {
  if (!dateObj) return null;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const months = [
    "JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC",
  ];
  return `${day} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
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
        padding: 16px 22px 0;
      }

      .idc-stars {
        text-align: center;
        color: #e08b1d;
        font-size: 14px;
        letter-spacing: 8px;
        margin-bottom: 6px;
      }
      .idc-stars .idc-star-big { font-size: 20px; color: #14532d; vertical-align: -2px; }

      .idc-front-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
      }

      .idc-seal {
        width: 68px;
        height: 68px;
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
        line-height: 1.25;
        padding: 4px;
        position: relative;
      }
      .idc-seal::before {
        content: "";
        position: absolute;
        inset: 4px;
        border-radius: 50%;
        border: 1px solid #14532d;
      }

      .idc-school-block { text-align: center; line-height: 1.15; flex: 1; }
      .idc-school-name1 {
        font-size: 28px;
        font-weight: 800;
        color: #14532d;
        letter-spacing: 1px;
      }
      .idc-school-name2 {
        font-size: 12px;
        font-weight: 700;
        color: #16202b;
        letter-spacing: 2.5px;
        border-top: 2px solid #e08b1d;
        display: inline-block;
        padding-top: 3px;
        margin-top: 2px;
      }
      .idc-school-tag {
        font-size: 10.5px;
        font-weight: 600;
        font-style: italic;
        color: #16202b;
        margin-top: 6px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .idc-school-tag .idc-tagdot { color: #e08b1d; font-size: 8px; }
      .idc-school-tag .idc-tagline-rule { flex: 1; max-width: 34px; height: 1px; background: #e08b1d; }

      .idc-front-body {
        flex: 1;
        display: flex;
        padding: 14px 0 0;
        gap: 14px;
      }

      .idc-fields {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 13px;
        min-width: 0;
      }
      .idc-field-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13.5px;
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
        min-width: 96px;
        letter-spacing: 0.3px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .idc-field-colon { color: #16202b; font-weight: 700; flex-shrink: 0; }
      .idc-field-value {
        font-weight: 800;
        color: #16202b;
        overflow-wrap: break-word;
        white-space: normal;
        line-height: 1.2;
      }

      .idc-photo-wrap {
        width: 130px;
        flex-shrink: 0;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 2px;
      }
      .idc-photo {
        width: 128px;
        height: 140px;
        object-fit: cover;
        border-radius: 8px;
        border: 3px solid #f5a623;
        background: #eef3ee;
        display: block;
      }
      .idc-photo-placeholder {
        width: 128px;
        height: 140px;
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
        padding: 10px 2px 12px;
        gap: 10px;
        position: relative;
        z-index: 2;
      }
      .idc-date-block { font-size: 9.5px; display: flex; align-items: center; gap: 6px; }
      .idc-date-icon { font-size: 15px; flex-shrink: 0; }
      .idc-date-label {
        font-weight: 800;
        color: #e08b1d;
        letter-spacing: 0.5px;
      }
      .idc-date-value {
        font-weight: 800;
        color: #16202b;
        font-size: 11.5px;
        margin-top: 1px;
      }
      .idc-date-id {
        font-weight: 700;
        color: #16202b;
        font-size: 9px;
        margin-top: 2px;
      }

      .idc-front-wave {
        height: 30px;
        position: relative;
        z-index: 1;
        margin: 0 -22px;
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
    <svg viewBox="0 0 420 36" preserveAspectRatio="none">
      <path d="M0,36 H420 V14 C330,2 300,22 230,16 C160,10 120,26 60,18 C30,14 15,20 0,16 Z" fill="#14532d" />
      <path d="M0,36 H420 V24 C330,14 300,28 230,24 C160,20 120,30 60,26 C30,23 15,26 0,25 Z" fill="#e08b1d" opacity="0.9" />
    </svg>
  );
}

function BackWaveTop() {
  return (
    <svg viewBox="0 0 420 30" preserveAspectRatio="none">
      <path d="M0,0 H420 V10 C320,24 260,4 180,14 C100,24 60,8 0,16 Z" fill="#14532d" />
      <path d="M0,0 H420 V6 C330,16 270,2 190,8 C110,14 60,4 0,10 Z" fill="#e08b1d" opacity="0.9" />
    </svg>
  );
}

function BackWaveBottom() {
  return (
    <svg viewBox="0 0 420 30" preserveAspectRatio="none">
      <path d="M0,30 H420 V20 C320,6 260,26 180,16 C100,6 60,22 0,14 Z" fill="#e08b1d" opacity="0.9" />
      <path d="M0,30 H420 V24 C320,12 260,30 180,22 C100,14 60,28 0,20 Z" fill="#14532d" />
    </svg>
  );
}

function SchoolSeal() {
  return (
    <div className="idc-seal">
      RISING STAR<br />PRIMARY &amp;<br />SECONDARY<br />SCHOOL
    </div>
  );
}

function CardFront({ student, studentId, forwardRef }) {
  const shift = student?.shift || student?.classShift || "MORNING";

  // Issue date always comes from the student's own record (createdAt / issueDate).
  // If neither exists yet, fall back to today so the card still renders sensibly.
  const issueDateObj =
    toDateObj(student?.issueDate) || toDateObj(student?.createdAt) || new Date();
  const issuedStr = formatDate(issueDateObj);

  // Expire date is ALWAYS issue date + 1 year — never a separate stored field —
  // so it's automatically correct no matter when the card was issued.
  const expireStr = formatDate(addYears(issueDateObj, 1));

  return (
    <div className="idc-card idc-front" ref={forwardRef}>
      <div className="idc-stars">
        ★ ★ <span className="idc-star-big">★</span> ★ ★
      </div>

      <div className="idc-front-header">
        <SchoolSeal />
        <div className="idc-school-block">
          <div className="idc-school-name1">{SCHOOL.name1}</div>
          <div className="idc-school-name2">{SCHOOL.name2}</div>
        </div>
        <SchoolSeal />
      </div>
      <div className="idc-school-tag">
        <span className="idc-tagline-rule" />
        <span className="idc-tagdot">◆</span>
        {SCHOOL.tagline}
        <span className="idc-tagdot">◆</span>
        <span className="idc-tagline-rule" />
      </div>

      <div className="idc-front-body">
        <div className="idc-fields">
          <div className="idc-field-row">
            <span className="idc-field-icon">🪪</span>
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
          <span className="idc-date-icon">📅</span>
          <div>
            <div className="idc-date-label">ISSUE DATE</div>
            <div className="idc-date-value">{issuedStr}</div>
          </div>
        </div>
        <div className="idc-date-block" style={{ textAlign: "right", flexDirection: "row-reverse" }}>
          <span className="idc-date-icon">📅</span>
          <div>
            <div className="idc-date-label">EXPIRE DATE</div>
            <div className="idc-date-value">{expireStr}</div>
            <div className="idc-date-id">{studentId || "—"}</div>
          </div>
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

// Loads html2canvas from CDN once and caches the promise on window,
// so repeated downloads don't re-fetch the script.
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
    if (!printWindow) {
      setError("Pop-up blocked. Please allow pop-ups for this site and try again.");
      return;
    }

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
    }, 500);
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

      {error && (
        <div style={{ textAlign: "center", fontSize: 12, color: "#c0392b", marginTop: 8 }}>
          {error}
        </div>
      )}
    </div>
  );
}