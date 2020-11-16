import './App.css';
import Home from './components/screens/home'
import Signin from './components/screens/login'
import Profile from './components/screens/profile'
import Signup from './components/screens/signup'
import CreatePost from './components/screens/createPost';
import Navbar from './components/navbar';
import{BrowserRouter,Route, Switch} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <Navbar></Navbar>
    <Switch>
    
      <Route path='/' exact><Home></Home></Route>
      <Route path='/signin'><Signin></Signin></Route>
      <Route path='/signup'><Signup></Signup></Route>
      <Route path='/profile'><Profile></Profile></Route>
      <Route path='/createpost'><CreatePost></CreatePost></Route>

    </Switch>
    </BrowserRouter>
    
  );
}

export default App;
