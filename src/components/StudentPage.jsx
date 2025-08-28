import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

function StudentPage({ user }) {
  const { email } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", course: "", imageUrl: "" });
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
          imageUrl: data.imageUrl || "",
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
        imageUrl: form.imageUrl,
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

  if (!student) return <div className="container mt-4 text-center">Loading...</div>;

  return (
    <div className="container mt-5">
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body text-center">
          <img
            src={student.imageUrl || "fallback.jpg"}
            alt={student.name}
            className="rounded-circle mb-3"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
          {!editMode ? (
            <>
              <h3 className="card-title mb-2">{student.name}</h3>
              <p className="text-muted mb-1">Email: {email}</p>
              <p className="text-muted mb-1">Age: {student.age}</p>
              <p className="text-muted mb-3">Course: {student.course}</p>

              {user?.isAdmin && (
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-warning" onClick={() => setEditMode(true)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleUpdate} className="text-start mt-3">
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Age</label>
                <input
                  className="form-control"
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Course</label>
                <input
                  className="form-control"
                  type="text"
                  name="course"
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
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-success" disabled={loading}>
                  {loading ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentPage;
