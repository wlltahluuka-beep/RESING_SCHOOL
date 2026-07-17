import "../styles/home.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">

      <div className="overlay">

        <div className="card">

          <img src={logo} className="logo" />

          <h1>RESING SCHOOL </h1>

          <h3>School Management ERP System</h3>

          <div className="line"></div>

          <div className="grid">

            <Link className="box admin" to="/admin-login">
              <div className="icon">👨‍💼</div>

              <div>
                <h2>ADMIN</h2>
                <p>Manage entire school system</p>
              </div>

              <span>➜</span>
            </Link>

            <Link className="box teacher" to="/teacher-login">
              <div className="icon">👨‍🏫</div>

              <div>
                <h2>TEACHER</h2>
                <p>Classes, Attendance & Exams</p>
              </div>

              <span>➜</span>
            </Link>

            <Link className="box student" to="/student-login">
              <div className="icon">🎓</div>

              <div>
                <h2>STUDENT</h2>
                <p>Results, Homework & Profile</p>
              </div>

              <span>➜</span>
            </Link>

            <Link className="box cashier" to="/cashier-login">

<div className="icon">

💰

</div>

<div>

<h2>CASHIER</h2>

<p>

School Payments

</p>

</div>

<span>

➜

</span>

</Link>

            <Link className="box parent" to="/parent-login">
              <div className="icon">👨‍👩‍👧</div>

              <div>
                <h2>PARENT</h2>
                <p>Track Child Progress</p>
              </div>

              <span>➜</span>
            </Link>

          </div>

          <div className="secure">
            🔒 Secure & Complete School Management Solution
          </div>

        </div>

      </div>

    </div>
  );
}