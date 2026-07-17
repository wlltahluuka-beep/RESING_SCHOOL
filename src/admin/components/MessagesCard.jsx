import { Bell } from "lucide-react";
import mail from "../assets/mail.png";

export default function MessagesCard({ messages = [] }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#2F1F8F,#4F46E5)",
        borderRadius: 24,
        color: "#fff",
        padding: 30,
        minHeight: 520,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          Fariimaha Ugu Dambeeyay
        </h2>

        <div
          style={{
            width: 55,
            height: 55,
            borderRadius: "50%",
            background: "rgba(255,255,255,.12)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bell />
        </div>
      </div>

      <p
        style={{
          color: "#dbeafe",
          marginTop: 20,
        }}
      >
        {messages.length === 0
          ? "Weli fariin lama helin."
          : `${messages.length} fariimood ayaa jira.`}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 45,
        }}
      >
        <img
          src={mail}
          alt=""
          style={{
            width: 240,
          }}
        />
      </div>

      <button
        style={{
          position: "absolute",
          bottom: 25,
          right: 25,
          border: "none",
          borderRadius: 16,
          padding: "14px 25px",
          background: "#6D5DF0",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Send Announcement ✈
      </button>
    </div>
  );
}