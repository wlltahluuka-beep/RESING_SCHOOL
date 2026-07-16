import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import AddStudent from "./admin/pages/AddStudent";
import Students from "./admin/pages/Students";
import Teachers from "./admin/pages/Teachers";
import Parents from "./admin/pages/Parents";
import Classes from "./admin/pages/Classes";
import Attendance from "./admin/pages/Attendance";
import Exams from "./admin/pages/Exams";
import Reports from "./admin/pages/Reports";
import Settings from "./admin/pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/add-student" element={<AddStudent />} />
        
        {/* Routes cusub */}
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/teachers" element={<Teachers />} />
        <Route path="/admin/parents" element={<Parents />} />
        <Route path="/admin/classes" element={<Classes />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/exams" element={<Exams />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Login Routes */}
        <Route path="/admin-login" element={<Login role="Admin" />} />
        <Route path="/teacher-login" element={<Login role="Teacher" />} />
        <Route path="/student-login" element={<Login role="Student" />} />
        <Route path="/parent-login" element={<Login role="Parent" />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;