import { NavLink, useLocation } from "react-router-dom";

function Loghead() {
  const location = useLocation();

  return (
    <>
      <div className="log-logo-position">
        <div className="log-logo"></div>
      </div>

      <div className="log-sign-position">
        <ul className="log-sign">
          <li
            className={`log-title ${
              location.pathname === "/login" ? "active" : ""
            }`}
          >
            <NavLink to="/login">Login</NavLink>
          </li>
          <li
            className={`sign-title ${
              location.pathname === "/join" ? "active" : ""
            }`}
          >
            <NavLink to="/join">Sign up</NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Loghead;
