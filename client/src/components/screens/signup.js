import React from 'react'
import {Link} from 'react-router-dom';
const signup = () => {
    return (
        <div className="mycard">
          <div className="card auth-card">
        <h2>Instagram</h2>
        <input type="text"placeholder="name"></input>
        <input type="text"placeholder="email"></input>
        <input type="text"placeholder="password"></input>
        <button class="btn waves-effect waves-light #64b5f6 blue darken-1">Signup</button>
        <h5><Link to="/signin">Already have an account?</Link></h5>
      </div>
        </div>
    )
}

export default signup
