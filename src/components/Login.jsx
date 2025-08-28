import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Google } from "react-bootstrap-icons";

function Login({ setUser }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.email);
      const userSnap = await getDoc(userRef);

      setUser({ uid: user.uid, ...userSnap.data(), email: user.email });

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 rounded-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body text-center">
          <h3 className="mb-3">
            Welcome to <span className="text-primary fw-bold">StudentVault</span>
          </h3>
          <p className="text-muted mb-4">Sign in to continue</p>
          <button
            onClick={handleLogin}
            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center py-2"
          >
            <Google className="me-2" size={22} />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
