import React from 'react'
import {Link} from 'react-router-dom'
const navbar = () => {
    return (
        <nav>
        <div className="nav-wrapper white">
          <Link to="/" className="brand-logo left">Instagram </Link>
          <ul id="nav-mobile" className="right ">
          <li><Link to="/createpost"><h5>+</h5></Link></li>
            <li><Link to="/signin">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/profile">profile</Link></li>
            
          </ul>
        </div>
      </nav>
    )
}

export default navbar;
