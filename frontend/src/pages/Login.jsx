/* eslint-disable no-undef */
import axios from 'axios';
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {AppContext} from '../context/UserContext';

function Login() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('')
  const navigate = useNavigate()

  const {setCurrentUser} = useContext(AppContext)

  const changeInputHandler = (e) =>{
    setUserData(
      {...userData, [e.target.name]: e.target.value}
    )
    console.log(userData)
  }

  const loginSubmit = async(e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData)
      const newUser = await response.data

      console.log(newUser)
      if(!newUser) setError('Could not login the user. Please try again.')

      setCurrentUser(newUser)      // JSON.parse(localStorage.getItem("user"))
      navigate('/')
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  return (
    <section className="login">
    <div className="container">
      <h2>Sign In</h2>
      <form className="form login__form" onSubmit={loginSubmit}>
      {error && <p className="form__error-message">{error}</p>}
        <input type="email" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler} />
        <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
        <button className="btn primary" type='submit'>Login</button>
      </form>
      <small>Don&apos;t have an account ? <Link to="/register">sign up</Link></small>
    </div>
  </section>
  )
}

export default Login