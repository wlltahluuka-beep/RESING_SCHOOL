export default function DashboardCard({
    title,
    value,
    color,
    icon
}){

return(

<div
style={{

background:"#fff",

padding:"25px",

borderRadius:"15px",

boxShadow:"0 5px 20px rgba(0,0,0,.08)",

borderLeft:`6px solid ${color}`

}}

>

<div
style={{

fontSize:"45px"

}}

>

{icon}

</div>

<h1>{value}</h1>

<p>{title}</p>

</div>

)

}