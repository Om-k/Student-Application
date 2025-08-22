import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import StudentList from "./components/StudentList";
import StudentPage from "./components/StudentPage";
import AddStudent from "./components/AddStudent";

function App() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser({ uid: currentUser.uid, ...userSnap.data(), email: currentUser.email });
        }
      } else {
        setUser(null);
      }

      setLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!loaded) return <div>Loading...</div>;

  return (
    <Router>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        {!user ? (
          <Route path="*" element={<Login setUser={setUser} />} />
        ) : user.isAdmin ? (
          <>
            <Route path="/" element={<StudentList />} />
            <Route path="/add" element={<AddStudent />} />
            <Route path="/student/:email" element={<StudentPage user={user} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to={`/student/${user.email}`} />} />
            <Route path="/student/:email" element={<StudentPage user={user} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
