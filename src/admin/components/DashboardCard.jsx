import { MoreVertical } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  color,
  icon,
  percent = "0%",
}) {
  return (
    <div
      style={{
        background: "#0F172A",
        border: `1px solid ${color}55`,
        borderRadius: 22,
        padding: 24,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        minHeight: 220,
        boxShadow: `0 0 25px ${color}22`,
      }}
    >
      {/* Top */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: `${color}22`,
            border: `2px solid ${color}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 34,
          }}
        >
          {icon}
        </div>

        <MoreVertical size={22} color="#fff" />
      </div>

      {/* Number */}
      <div
        style={{
          marginTop: 18,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 58,
            fontWeight: "bold",
          }}
        >
          {value}
        </h1>

        <h3
          style={{
            margin: "8px 0 0",
            fontWeight: 500,
            fontSize: 28,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color,
            fontWeight: 600,
            marginTop: 10,
            fontSize: 18,
          }}
        >
          ↑ {percent}
          <span
            style={{
              color: "#cbd5e1",
              marginLeft: 6,
              fontWeight: 400,
            }}
          >
            this month
          </span>
        </p>
      </div>

      {/* Bottom Wave */}
      <svg
        viewBox="0 0 400 70"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 70,
        }}
      >
        <path
          d="
            M0,40
            C20,10 40,10 60,40
            S100,70 120,40
            S160,10 180,40
            S220,70 240,40
            S280,10 300,40
            S340,70 360,40
            S390,10 400,40
          "
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}