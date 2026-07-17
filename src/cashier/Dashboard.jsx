export default function Dashboard() {
  return (
    <div>

      <h1>💰 Cashier Dashboard</h1>

      <br />

      <div style={{display:"flex",gap:20}}>

        <div style={card}>
          <h2>$0</h2>
          <p>Today's Collection</p>
        </div>

        <div style={card}>
          <h2>$0</h2>
          <p>Monthly Collection</p>
        </div>

        <div style={card}>
          <h2>0</h2>
          <p>Students Paid</p>
        </div>

        <div style={card}>
          <h2>0</h2>
          <p>Students Remaining</p>
        </div>

      </div>

    </div>
  );
}

const card={
width:250,
padding:25,
background:"#fff",
borderRadius:12,
boxShadow:"0 5px 20px rgba(0,0,0,.1)"
};