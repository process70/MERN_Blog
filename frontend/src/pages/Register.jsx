import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

function Register() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const changeInputHandler = (e) =>{
    setUserData(
      {...userData, [e.target.name]: e.target.value}
    )
  }
  const [errorUser, setError] = useState('')
  const navigate = useNavigate()

  const registerUser = async(e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData)
      const newUser = await response.data.message
      console.log(newUser)
      if(!newUser) setError('Could not register the user. Please try again.')
      navigate('/')
    } catch (err) {
      setError(err.response.data.message)
    }
  }
  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          {errorUser && <p className="form__error-message">{errorUser}</p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler} />
          <input type="email" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <input type="password" placeholder='Confirm Password' name='password2' value={userData.password2} onChange={changeInputHandler} />
          <button className="btn primary" type='submit'>Register</button>
        </form>
        <small>Already have an account ? <Link to="/login">sign in</Link></small>
      </div>
    </section>
  )
}

export default Register