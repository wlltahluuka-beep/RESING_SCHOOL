import { Link } from "react-router-dom";

export default function Sidebar(){

return(

<div style={sidebar}>

<h2 style={{color:"white"}}>

💰 CASHIER

</h2>

<Link style={link} to="/cashier/dashboard">

Dashboard

</Link>

<Link style={link} to="/cashier/payments">

Payments

</Link>

<Link style={link} to="/cashier/reports">

Reports

</Link>

<Link style={link} to="/cashier/profile">

Profile

</Link>

</div>

)

}

const sidebar={

width:240,

height:"100vh",

background:"#1565c0",

padding:20

};

const link={

display:"block",

padding:12,

marginTop:12,

background:"white",

textDecoration:"none",

borderRadius:8,

color:"#1565c0",

fontWeight:"bold"

};