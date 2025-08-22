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
      setMessage("Student already exists!");
      return;
    }
    await setDoc(studentRef, {
      name: form.name,
      age: form.age,
      course: form.course,
      imageUrl: form.imageUrl,
      createdAt: serverTimestamp(),
    });
    setMessage("Student added successfully!");
    setForm({ email: "", name: "", age: "", course: "" });
  };

  return (
    <div className="container mt-4">
      <h2>Add Student</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="mt-3">
        <input className="form-control mb-2" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="form-control mb-2" type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="form-control mb-2" type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required />
        <input className="form-control mb-2" type="text" name="imageUrl" placeholder="ImageUrl" value={form.imageUrl} onChange={handleChange} required />
        <button className="btn btn-primary">Add Student</button>
      </form>
    </div>
  );
}

export default AddStudent;
