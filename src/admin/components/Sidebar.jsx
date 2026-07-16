import { NavLink } from "react-router-dom";

const menus = [
  { name: "🏠 Dashboard", path: "/admin/dashboard" },
  { name: "🎓 Students", path: "/admin/students" },
  { name: "👨‍🏫 Teachers", path: "/admin/teachers" },
  { name: "👨‍👩‍👧 Parents", path: "/admin/parents" },
  { name: "🏫 Classes", path: "/admin/classes" },
  { name: "📅 Attendance", path: "/admin/attendance" },
  { name: "📝 Exams", path: "/admin/exams" },
  { name: "📊 Reports", path: "/admin/reports" },
  { name: "⚙️ Settings", path: "/admin/settings" },
];

export default function Sidebar() {
  return (
    <div
      style={{
        width: "260px",
        background: "#065f46",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        position: "relative", // Waxaa lagama maarmaan ah in parent-ka uu leeyahay relative position
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "35px",
          fontSize: "24px",
        }}
      >
        RESING ERP
      </h2>

      {menus.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: "block",
            padding: "14px 18px",
            marginBottom: "12px",
            textDecoration: "none",
            color: "#fff",
            borderRadius: "10px",
            background: isActive ? "#10b981" : "transparent",
            fontSize: "16px",
            fontWeight: "600",
            transition: "0.3s",
          })}
        >
          {item.name}
        </NavLink>
      ))}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "0",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            width: "170px",
            height: "42px",
            border: "none",
            borderRadius: "10px",
            background: "#dc2626",
            color: "#fff",
            fontWeight: "600",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}