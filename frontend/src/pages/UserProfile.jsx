import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/UserContext';
import { Link } from 'react-router-dom'
import { FaEdit, FaCheck } from "react-icons/fa";
import axios from 'axios';

function UserProfile() {
  const navigate = useNavigate()
  const {currentUser} = useContext(AppContext)
  const token = currentUser?.token
  const {id} = useParams()

  const [isAvatarTouched, setIsAvatarTouched] = useState(false)
  const [error, setError] = useState('')
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  useEffect(() => {
    if(!token) navigate("/login")
    getCurrentUser()
  }, [])

  const getCurrentUser = async() => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`)
    if(response.status === 200){
      setName(response.data.name)
      setEmail(response.data.email)
      setAvatar(response.data.avatar)
    }
  }

  const avatarHandler = async(e) => {
    e.preventDefault();           // prevent the page to be reloaded
    try {
      const formData = new FormData()
      formData.append('avatar', avatar)
      
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, formData, {
        headers: {Authorization: `Bearer ${token}`}
      })
      console.log("the edited avatar name: "+response?.data.avatar)
      setAvatar(response?.data.avatar)
    } catch (err) {
      setError(err)
    }
    setIsAvatarTouched(false)
  }

  const updateUserHandler = async(e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.set('name', name)
      formData.set('email', email)
      formData.set('currentPassword', currentPassword)
      formData.set('newPassword', newPassword)
      formData.set('confirmNewPassword', confirmNewPassword)

      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit`, formData, {
        headers: {Authorization: `Bearer ${token}`}
      })
      if(response.status === 200) navigate(`/logout`)
    } catch (err) {
      setError(err.response.data.message)
    }
  }

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={'/myposts/'+currentUser.id}>My Posts</Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={`${avatar}`} alt="" />
            </div>
            <form action="" className="avatar__form" onSubmit={avatarHandler}>
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}><FaEdit /></label>
              <input type="file" id='avatar' name='avatar' onChange={e => {setAvatar(e.target.files[0])}}/>
              {isAvatarTouched && <button className="profile__avatar-btn"><FaCheck /></button>}
            </form>
            
          </div>
          <h2>{currentUser.name}</h2>
          <form className="form profile__form" onSubmit={updateUserHandler}>
            {error && <p className="form__error-message">{error}</p>}
            <input type="text" placeholder='Full Name' value={name} autoFocus 
                  onChange={e => setName(e.target.value)}/>
            <input type="email" placeholder='Email' value={email} 
                  onChange={e => setEmail(e.target.value)}/>      
            <input type="password" placeholder='Current Password' value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)}/>
            <input type="password" placeholder='New Password' value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)}/>
            <input type="password" placeholder='Confirm New Password' value={confirmNewPassword} 
                  onChange={e => setConfirmNewPassword(e.target.value)}/>      
            <button type="submit" className="btn primary">Update details</button>      
          </form>
        </div>
      </div>
    </section>
  )
}

export default UserProfile