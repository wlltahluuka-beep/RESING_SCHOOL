import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ role }) {

  const navigate = useNavigate();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const login=()=>{

      if(email==="" || password===""){
          alert("Fill all fields");
          return;
      }

      navigate("/admin/dashboard");

  }

  return(

<div
style={{
display:"flex",
justifyContent:"center",
alignItems:"center",
height:"100vh",
background:"#eef3fb"
}}
>

<div
style={{
width:"430px",
background:"white",
padding:"40px",
borderRadius:"20px",
boxShadow:"0 0 30px rgba(0,0,0,.1)"
}}
>

<h1>{role} Login</h1>

<br/>

<input

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

style={input}

/>

<br/><br/>

<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

style={input}

/>

<br/><br/>

<button

style={button}

onClick={login}

>

LOGIN

</button>

</div>

</div>

  )

}

const input={

width:"100%",

padding:"15px",

fontSize:"17px",

borderRadius:"10px",

border:"1px solid #ccc"

}

const button={

width:"100%",

padding:"15px",

background:"#0d6efd",

color:"white",

border:"none",

borderRadius:"10px",

fontSize:"18px",

cursor:"pointer"

}