import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "students"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(list);
    };
    fetchStudents();
  }, []);

  return (
    <div className="container mt-4">
        <h2 className="me-3 mb-3" style={{ fontWeight: 600 }}>
          All Students
        </h2>   
      <div className="row g-4">
        {students.map((student) => (
          <div key={student.id} className="col-sm-6 col-md-4 col-lg-3 d-flex">
            <div className="card flex-fill shadow-sm">
              <img
                src={student.imageUrl || "fallback.jpg"}
                alt={student.name}
                className="card-img-top"
                style={{ objectFit: "cover", height: "180px" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate" title={student.name}>
                  {student.name}
                </h5>
                <p className="mb-2 text-muted">Age: {student.age}</p>
           
                <Link
                  to={`/student/${student.id}`}
                  className="btn btn-primary mt-auto"
                >
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
