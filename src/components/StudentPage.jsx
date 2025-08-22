import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

function StudentPage({ user }) {
  const { email } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", course: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      const studentRef = doc(db, "students", email);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        const data = studentSnap.data();
        setStudent(data);
        setForm({
          name: data.name,
          age: data.age,
          course: data.course,
          image: data.image || "",
        });
      }
    };
    fetchStudent();
  }, [email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const studentRef = doc(db, "students", email);

      await updateDoc(studentRef, {
        name: form.name,
        age: form.age,
        course: form.course,
        imageUrl: form.imageUrl, // directly use the URL
      });

      setStudent({ ...form });
      setMessage("✅ Student updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("❌ Failed to update student.");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await deleteDoc(doc(db, "students", email));
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete student.");
    }
  };

  if (!student) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      {message && <div className="alert alert-info">{message}</div>}
      {!editMode ? (
        <>
          <img
            src={student.imageUrl || "fallback.jpg"}
            alt="Student"
            className="img-thumbnail mb-3"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
          <h2>{student.name}</h2>
          <p>Email: {email}</p>
          <p>Age: {student.age}</p>
          <p>Course: {student.course}</p>

          {user?.isAdmin && (
            <div className="mt-3">
              <button className="btn btn-warning me-2" onClick={() => setEditMode(true)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleUpdate} className="mt-3">
          <input
            className="form-control mb-2"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            type="text"
            name="course"
            value={form.course}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
          <button className="btn btn-success me-2" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default StudentPage;
