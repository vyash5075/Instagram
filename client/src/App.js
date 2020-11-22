import "./App.css";
import React, { useEffect, createContext, useReducer, useContext } from "react";
import { useHistory } from "react-router-dom";
import Home from "./components/screens/home";
import Signin from "./components/screens/login";
import Profile from "./components/screens/profile";
import Signup from "./components/screens/signup";
import CreatePost from "./components/screens/createPost";
import UserProfile from "./components/screens/UserProfile";
import Subscribefollowers from "./components/screens/SubscribeUserPosts";
import { reducer, initialState } from "./reducers/reducer";
import Navbar from "./components/navbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
//useReducer is equivalent to useState hook  whenever state changes our component will rerender
export const userContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      // history.push("/");
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <>
      <Switch>
        <Route path="/" exact>
          <Home></Home>
        </Route>
        <Route path="/signin" exact>
          <Signin></Signin>
        </Route>
        <Route path="/signup" exact>
          <Signup></Signup>
        </Route>
        <Route path="/profile" exact>
          <Profile></Profile>
        </Route>
        <Route exact path="/profile/:userid">
          <UserProfile></UserProfile>
        </Route>
        <Route path="/createpost" exact>
          <CreatePost></CreatePost>
        </Route>

        <Route path="/myfollowings" exact>
          <Subscribefollowers></Subscribefollowers>
        </Route>
      </Switch>
    </>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <userContext.Provider value={{ state: state, dispatch: dispatch }}>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routing></Routing>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
