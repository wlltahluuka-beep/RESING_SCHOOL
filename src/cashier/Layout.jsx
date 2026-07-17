import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout(){

return(

<div style={{display:"flex"}}>

<Sidebar/>

<div style={{

flex:1,

padding:25,

background:"#f5f7fb",

minHeight:"100vh"

}}>

<Outlet/>

</div>

</div>

)

}