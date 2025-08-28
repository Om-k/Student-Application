import { Link } from "react-router-dom";
import { BoxArrowRight, PlusLg } from "react-bootstrap-icons";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm p-3">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          StudentVault
        </Link>

        {/* Right Side Buttons */}
        <div className="d-flex align-items-center">
          {user.isAdmin && (
            <Link
              to="/add"
              className="btn btn-light text-primary fw-semibold me-3 d-flex align-items-center"
            >
              <PlusLg className="me-2" size={18} />
              Add Student
            </Link>
          )}
          <button
            onClick={onLogout}
            className="btn btn-outline-light fw-semibold d-flex align-items-center"
          >
            <BoxArrowRight className="me-2" size={18} />
            Logout ({user.name})
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
