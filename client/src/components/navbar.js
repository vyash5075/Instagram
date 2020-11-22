import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { userContext } from "../App";
const Navbar = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);

  const logout = () => {
    window.localStorage.clear();
    dispatch({ type: "CLEAR" });
    history.push("/signin");
  };

  const renderList = () => {
    if (state) {
      return [
        <li key="a">
          <Link to="/createpost">CreatePost(+)</Link>
        </li>,
        <li key="a">
          <Link to="/myfollowings">Followings</Link>
        </li>,
        <li>
          <Link to="/profile">profile</Link>
        </li>,
        <li
          key="b"
          style={{ color: "black" }}
          onClick={() => {
            logout();
          }}
        >
          logout
        </li>,
      ];
    } else {
      return [
        <li key="c">
          <Link to="/signin">Login</Link>
        </li>,
        <li key="d">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram{" "}
        </Link>
        <ul id="nav-mobile" className="right ">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
