import { useState } from "react";

export default function AddStudent() {

  const [student, setStudent] = useState({
    fullName: "",
    gender: "",
    dob: "",
    studentPhone: "",
    parentName: "",
    parentPhone: "",
    district: "",
    className: "",
    section: "",
    previousSchool: "",
    orphan: "No",
    password: ""
  });

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  const saveStudent = () => {
    console.log(student);
  };

  return (
    <div style={{ padding:30 }}>

      <h1>Add Student</h1>

      <input
        name="fullName"
        placeholder="Full Name"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="studentPhone"
        placeholder="Student Phone"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="parentName"
        placeholder="Parent Name"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="parentPhone"
        placeholder="Parent Phone"
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={saveStudent}>
        Save Student
      </button>

    </div>
  );
}