import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "students"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(list);
    };
    fetchStudents();
  }, []);

  return (
    <div className="container mt-4">
      <h2>All Students</h2>
      <div className="row">
        {students.map((student) => (
          <div key={student.id} className="col-md-4 mb-3">

            <img src={student.imageUrl || 'fallback.jpg'} alt="Student" className="img-thumbnail" />

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{student.name}</h5>
                <p>Age: {student.age}</p>
                <Link to={`/student/${student.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentList;
