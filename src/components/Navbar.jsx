import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Student App</Link>
        <div className="d-flex">
          {user.isAdmin && (
            <Link to="/add" className="btn btn-light me-2">
              Add Student
            </Link>
          )}
          <button onClick={onLogout} className="btn btn-outline-light">
            Logout ({user.name})
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
