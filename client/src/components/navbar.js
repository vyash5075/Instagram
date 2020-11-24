import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { userContext } from "../App";
import M from "materialize-css";
const Navbar = () => {
  const [search, setSearch] = useState("");
  const [userdetails, setuserDetails] = useState([]);
  const searchModal = useRef(null);
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);

  const logout = () => {
    window.localStorage.clear();
    dispatch({ type: "CLEAR" });
    history.push("/signin");
  };

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <Link to="/createpost">
            {" "}
            <i
              data-target="modal1"
              className="material-icons modal-trigger"
              style={{}}
            >
              {" "}
              search{" "}
            </i>
          </Link>
        </li>,
        <li key="2">
          <Link to="/createpost">
            {" "}
            <i className="material-icons" style={{}}>
              {" "}
              add_a_photo{" "}
            </i>
          </Link>
        </li>,
        <li key="3">
          <Link to="/myfollowings">Followings</Link>
        </li>,
        <li key="5">
          <Link to="/profile">
            <i className="material-icons" style={{}}>
              {" "}
              person_pin{" "}
            </i>
          </Link>
        </li>,
        <li
          key="b"
          style={{ color: "black", marginRight: "10px" }}
          onClick={() => {
            logout();
          }}
        >
          logout
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Login</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("http://localhost:4000/user/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setuserDetails(results.user);
        console.log(results);
      })
      .catch((err) => console.log(err));
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
      <div
        id="modal1"
        className="modal"
        style={{ color: "black" }}
        ref={searchModal}
      >
        <div className="modal-content">
          <h2>Search fellows</h2>
          <input
            type="text"
            placeholder="search Fellows"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          ></input>
          <ul className="collection">
            {userdetails.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  {" "}
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            class="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
