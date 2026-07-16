import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCard from "../components/DashboardCard";

export default function Dashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fb" }}>

      <Sidebar />

      <div style={{ flex: 1 }}>

        <Topbar />

        <div style={{ padding: "30px" }}>

          <h1
            style={{
              color: "#065f46",
              fontSize: "40px",
              marginBottom: "10px",
            }}
          >
            Admin Dashboard
          </h1>

          <p style={{ color: "#666" }}>
            Welcome to Resing School 
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <DashboardCard
              title="Students"
              value="0"
              color="#2563eb"
              icon="🎓"
            />

            <DashboardCard
              title="Teachers"
              value="0"
              color="#16a34a"
              icon="👨‍🏫"
            />

            <DashboardCard
              title="Parents"
              value="0"
              color="#9333ea"
              icon="👨‍👩‍👧"
            />

            <DashboardCard
              title="Classes"
              value="0"
              color="#f59e0b"
              icon="🏫"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "15px",
                padding: "20px",
                minHeight: "400px",
                boxShadow: "0 5px 15px rgba(0,0,0,.08)",
              }}
            >
              <h2>Recent Students</h2>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: "15px",
                padding: "20px",
                minHeight: "400px",
                boxShadow: "0 5px 15px rgba(0,0,0,.08)",
              }}
            >
              <h2>Today's Attendance</h2>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}