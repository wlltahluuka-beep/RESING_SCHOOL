export default function Topbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        borderBottom: "1px solid #eee",
      }}
    >
      <h2>Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Search..."
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <img
          src="https://ui-avatars.com/api/?name=Admin"
          alt="Admin"
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
          }}
        />
      </div>
    </div>
  );
}