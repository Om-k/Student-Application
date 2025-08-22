import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

function Login({ setUser }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User",user);
      console.log("User email",user.email);
      

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.email);
      
      const userSnap = await getDoc(userRef);
      console.log("userSnap",{ uid: user.uid, ...userSnap.data(), email: user.email });


      // Pass user data to parent
      setUser({ uid: user.uid, ...userSnap.data(), email: user.email });

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <button className="btn btn-primary" onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
