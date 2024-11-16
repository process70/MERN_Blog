import React, { useContext, useState } from 'react'
import {Link} from 'react-router-dom'
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { AppContext } from '../context/UserContext';

function Header() {
  const {currentUser} = useContext(AppContext)
  const [show, setShow] = useState(window.innerWidth > 800 ? true: false);
  const closeNavBar = () => {
    if(window.innerWidth < 800) setShow(false)
    else setShow(true)
  }

  return (
    <nav>
      <div className="container nav__container">
        <Link to= "/" className="nav__logo" onClick={closeNavBar}>
          <img src="/logo192.png" alt="navbar logo" />
        </Link>
        {currentUser && show && <ul className="nav__menu">
          <li>
            <Link to = {`/profile/${currentUser.id}`} onClick={closeNavBar}>{currentUser?.name}</Link>
          </li>
          <li>
            <Link to= "/create" onClick={closeNavBar}>Create Post</Link>
          </li>
          <li>
            <Link to= "/authors" onClick={closeNavBar}>Authors</Link>
          </li>
          <li>
            <Link to= "/logout" onClick={closeNavBar}>Logout</Link>
          </li>
      </ul>}
      {!currentUser && show && <ul className="nav__menu">
          <li>
            <Link to= "/authors" onClick={closeNavBar}>Authors</Link>
          </li>
          <li>
            <Link to= "/login" onClick={closeNavBar}>Login</Link>
          </li>
      </ul>}
      <button className="nav__toggle-btn" onClick={() => setShow(!show)}>
          {show ? <AiOutlineClose />: <FaBars />}
      </button>  
    </div>
    </nav>
  )
}

export default Header