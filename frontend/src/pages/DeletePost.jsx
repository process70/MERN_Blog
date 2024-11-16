import React, { useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/UserContext';
import axios from 'axios';

function DeletePost({postId: id}) {

const navigate = useNavigate()
const {currentUser} = useContext(AppContext)
const token = currentUser?.token

const locatioon = useLocation() // useLocation hook is used to check which page we are deleting the post

useEffect(() => {
  if(!token) navigate("/login")
  console.log('current page: '+locatioon.pathname)

}, [])

const deletePostHandler = async() => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    })

    if(response.status == 200) {
      return navigate(`/myposts/${currentUser.id}`)
    }
    
  } catch (err){
    console.log(err.response.data.message)
  }
}

  return (
    <Link to={'/'} className='btn sm danger' onClick={deletePostHandler}>Delete</Link>
  )
}

export default DeletePost