import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/UserContext'


function Logout() {
  
  const {setCurrentUser} = useContext(AppContext)
  const navigate = useNavigate()
  setCurrentUser(null)
  navigate('/')
  return (
    <></>
  )
}

export default Logout