import { useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function AddStudent() {
  const [form, setForm] = useState({ email: "", name: "", age: "", course: "", imageUrl: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentRef = doc(db, "students", form.email);
    const studentSnap = await getDoc(studentRef);
    if (studentSnap.exists()) {
      setMessage("❌ Student already exists!");
      return;
    }
    await setDoc(studentRef, {
      name: form.name,
      age: form.age,
      course: form.course,
      imageUrl: form.imageUrl,
      createdAt: serverTimestamp(),
    });
    setMessage("✅ Student added successfully!");
    setForm({ email: "", name: "", age: "", course: "", imageUrl: "" });
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow-sm p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="card-body">
          <h2 className="mb-3 text-center">Add Student</h2>
          {message && <div className="alert alert-info text-center">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Enter name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Age</label>
              <input
                className="form-control"
                type="number"
                name="age"
                placeholder="Enter age"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Course</label>
              <input
                className="form-control"
                type="text"
                name="course"
                placeholder="Enter course"
                value={form.course}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                className="form-control"
                type="text"
                name="imageUrl"
                placeholder="Enter image URL"
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Add Student
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;
