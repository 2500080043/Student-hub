
import React, { useState, useEffect } from "react";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Arjun", rollNo: "101", department: "CSE", marks: 85 },
  { id: 2, name: "Keerthi", rollNo: "102", department: "AIDS", marks: 92 },
  { id: 3, name: "Rahul", rollNo: "103", department: "ECE", marks: 32 },
  { id: 4, name: "Priya", rollNo: "104", department: "CSE", marks: 76 },
  { id: 5, name: "Sneha", rollNo: "105", department: "AIDS", marks: 28 },
  { id: 6, name: "Kiran", rollNo: "106", department: "ECE", marks: 65 }
];

function getGrade(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  if (marks >= 40) return "D";
  return "F";
}

function Header({ page, navigate }) {
  const links = [
    ["Dashboard", "/"],
    ["Students", "/students"],
    ["Add Student", "/add"],
    ["Results", "/results"],
    ["About", "/about"]
  ];

  return (
    <header className="header">
      <div className="brand">
        <span className="logo">🎓</span>
        <div>
          <h2>StudentHub</h2>
          <small>Student Management System</small>
        </div>
      </div>

      <nav>
        {links.map(([name, path]) => (
          <button
            key={path}
            className={page === path ? "nav-link active" : "nav-link"}
            onClick={() => navigate(path)}
          >
            {name}
          </button>
        ))}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 StudentHub | Student Management System</p>
      <p>Built with React ❤️</p>
    </footer>
  );
}

function StudentTable({ students, onDelete, navigate }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Department</th>
            <th>Marks</th>
            <th>Grade</th>
            <th>Result</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.rollNo}</td>
              <td><strong>{student.name}</strong></td>
              <td>{student.department}</td>
              <td>{student.marks}/100</td>
              <td>{getGrade(student.marks)}</td>
              <td>
                <span className={student.marks >= 40 ? "pass" : "fail"}>
                  {student.marks >= 40 ? "PASS" : "FAIL"}
                </span>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit/${student.id}`)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {students.length === 0 && (
        <p className="empty">No student records found.</p>
      )}
    </div>
  );
}

function Dashboard({ students, navigate }) {
  const total = students.length;
  const passed = students.filter(s => s.marks >= 40).length;
  const failed = total - passed;

  const average = total
    ? (students.reduce((sum, s) => sum + s.marks, 0) / total).toFixed(1)
    : "0.0";

  return (
    <section>
      <div className="welcome">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your Student Management Portal!</p>
        </div>
        <button className="primary-btn" onClick={() => navigate("/add")}>
          + Add Student
        </button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <span>👥</span>
          <p>Total Students</p>
          <h2>{total}</h2>
        </div>
        <div className="stat-card">
          <span>✅</span>
          <p>Passed Students</p>
          <h2>{passed}</h2>
        </div>
        <div className="stat-card">
          <span>❌</span>
          <p>Failed Students</p>
          <h2>{failed}</h2>
        </div>
        <div className="stat-card">
          <span>📊</span>
          <p>Average Marks</p>
          <h2>{average}</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Recent Students</h2>
        <StudentTable
          students={students.slice(0, 4)}
          onDelete={() => {}}
          navigate={navigate}
        />
        <button className="secondary-btn" onClick={() => navigate("/students")}>
          View All Students →
        </button>
      </div>
    </section>
  );
}

function StudentsPage({ students, onDelete, navigate }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" ||
      (filter === "PASS" && student.marks >= 40) ||
      (filter === "FAIL" && student.marks < 40);

    return matchesSearch && matchesFilter;
  });

  return (
    <section>
      <div className="welcome">
        <div>
          <h1>Student Management</h1>
          <p>Search, edit and manage student records.</p>
        </div>
        <button className="primary-btn" onClick={() => navigate("/add")}>
          + Add Student
        </button>
      </div>

      <div className="panel">
        <div className="controls">
          <input
            placeholder="Search by name or roll number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="ALL">All Students</option>
            <option value="PASS">Passed</option>
            <option value="FAIL">Failed</option>
          </select>
        </div>

        <StudentTable
          students={filtered}
          onDelete={onDelete}
          navigate={navigate}
        />
        <p className="muted">Showing {filtered.length} students</p>
      </div>
    </section>
  );
}

function StudentForm({ students, onSave, navigate, editId }) {
  const existing = students.find(s => String(s.id) === String(editId));

  const [form, setForm] = useState(() => ({
    name: existing?.name || "",
    rollNo: existing?.rollNo || "",
    department: existing?.department || "CSE",
    marks: existing?.marks ?? ""
  }));

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.rollNo.trim() || form.marks === "") {
      alert("Please fill in all fields.");
      return;
    }

    const marks = Number(form.marks);

    if (!Number.isInteger(marks) || marks < 0 || marks > 100) {
      alert("Marks must be between 0 and 100.");
      return;
    }

    const duplicate = students.some(s =>
      s.rollNo.toLowerCase() === form.rollNo.trim().toLowerCase() &&
      String(s.id) !== String(editId)
    );

    if (duplicate) {
      alert("Roll number already exists!");
      return;
    }

    onSave({
      ...form,
      id: existing ? existing.id : Date.now(),
      name: form.name.trim(),
      rollNo: form.rollNo.trim(),
      marks
    });

    alert(existing ? "Student updated successfully!" : "Student added successfully!");
    navigate("/students");
  }

  return (
    <section>
      <div className="welcome">
        <div>
          <h1>{existing ? "Edit Student" : "Add New Student"}</h1>
          <p>Enter the student details below.</p>
        </div>
      </div>

      <div className="panel form-panel">
        <form onSubmit={handleSubmit}>
          <label>Student Name</label>
          <input
            placeholder="Enter student name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <label>Roll Number</label>
          <input
            placeholder="Enter roll number"
            value={form.rollNo}
            onChange={e => setForm({ ...form, rollNo: e.target.value })}
            required
          />

          <label>Department</label>
          <select
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })}
          >
            <option value="CSE">CSE</option>
            <option value="AIDS">AI & Data Science</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            <option value="EEE">EEE</option>
          </select>

          <label>Marks out of 100</label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            placeholder="Enter marks"
            value={form.marks}
            onChange={e => setForm({ ...form, marks: e.target.value })}
            required
          />

          <button className="primary-btn" type="submit">
            {existing ? "Update Student" : "Register Student"}
          </button>

          <button
            className="secondary-btn"
            type="button"
            onClick={() => navigate("/students")}
          >
            Cancel
          </button>
        </form>
      </div>
    </section>
  );
}

function Results({ students, onDelete, navigate }) {
  const passed = students.filter(s => s.marks >= 40);
  const failed = students.filter(s => s.marks < 40);

  const percentage = students.length
    ? ((passed.length / students.length) * 100).toFixed(1)
    : "0.0";

  return (
    <section>
      <div className="welcome">
        <div>
          <h1>Academic Results</h1>
          <p>Examination performance overview.</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <p>Pass Percentage</p>
          <h2>{percentage}%</h2>
        </div>
        <div className="stat-card">
          <p>Passed</p>
          <h2>{passed.length}</h2>
        </div>
        <div className="stat-card">
          <p>Failed</p>
          <h2>{failed.length}</h2>
        </div>
      </div>

      <div className="panel">
        <h2>Passed Students</h2>
        <StudentTable students={passed} onDelete={onDelete} navigate={navigate}/>

        <h2 className="section-gap">Failed Students</h2>
        <StudentTable students={failed} onDelete={onDelete} navigate={navigate}/>
      </div>
    </section>
  );
}

function About() {
  return (
    <div className="panel about">
      <h1>About StudentHub</h1>
      <p>
        StudentHub is a React-based student management application
        designed to organize student details and academic results.
      </p>
      <h2>Technologies Used</h2>
      <ul>
        <li>React JS</li>
        <li>JavaScript</li>
        <li>HTML and CSS</li>
        <li>Browser Local Storage</li>
      </ul>
      <h2>Core Concepts</h2>
      <ul>
        <li>React Components</li>
        <li>Props and State</li>
        <li>map() and filter()</li>
        <li>Conditional Rendering</li>
        <li>Event Handling</li>
        <li>useEffect Hook</li>
      </ul>
    </div>
  );
}

export default function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("studentHubData");
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [page, setPage] = useState(window.location.pathname);

  useEffect(() => {
    localStorage.setItem("studentHubData", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    const handleBack = () => setPage(window.location.pathname);
    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  function navigate(path) {
    window.history.pushState({}, "", path);
    setPage(path);
    window.scrollTo(0, 0);
  }

  function saveStudent(student) {
    setStudents(previous => {
      const exists = previous.some(s => s.id === student.id);

      return exists
        ? previous.map(s => s.id === student.id ? student : s)
        : [...previous, student];
    });
  }

  function deleteStudent(id) {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(previous => previous.filter(s => s.id !== id));
    }
  }

  const editMatch = page.match(/^\/edit\/(\d+)$/);
  const editId = editMatch ? editMatch[1] : null;

  let content;

  if (page === "/") {
    content = <Dashboard students={students} navigate={navigate}/>;
  } else if (page === "/students") {
    content = <StudentsPage students={students} onDelete={deleteStudent} navigate={navigate}/>;
  } else if (page === "/add") {
    content = <StudentForm students={students} onSave={saveStudent} navigate={navigate}/>;
  } else if (editId) {
    content = students.some(s => String(s.id) === editId)
      ? <StudentForm students={students} onSave={saveStudent} navigate={navigate} editId={editId}/>
      : <div className="panel"><h1>Student Not Found</h1><button className="primary-btn" onClick={() => navigate("/students")}>Back to Students</button></div>;
  } else if (page === "/results") {
    content = <Results students={students} onDelete={deleteStudent} navigate={navigate}/>;
  } else if (page === "/about") {
    content = <About/>;
  } else {
    content = <div className="panel"><h1>404 - Page Not Found</h1><button className="primary-btn" onClick={() => navigate("/")}>Go Home</button></div>;
  }

  return (
    <div className="app">
      <Header page={page} navigate={navigate}/>
      <main className="main-content">{content}</main>
      <Footer/>
    </div>
  );
}
