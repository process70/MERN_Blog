/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react'
import { DUMMY_POSTS } from '../data'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/UserContext';
import axios from 'axios';
import Loader from '../Components/Loader';
import DeletePost from './DeletePost';

function DashBoard() {
  const navigate = useNavigate()
  const {currentUser} = useContext(AppContext)
  const token = currentUser?.token
  const {id} = useParams()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  
  useEffect(() => {
    if(!token) navigate("/login")
      getPosts()
  }, [navigate, token])
  
  const getPosts = async() => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/authors/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
      })
      setPosts(response?.data)
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  if(isLoading) return <Loader />

  return (
    <section className="dashboard">
      {
        posts.length ? 
        <div className="container dashboard__container">
          {posts.map(post => (
            <article key={post.id} id={post.id} className="dashboard__post">
              <div className="dashboard__post-info">
                <div className="dashboard__post-thumbnail">
                  <img src={`${post?.thumbnail}`} alt="" />
                </div>
                <h5>{post.title}</h5>
              </div>
              <div className="dashboard__post-actions">
                <Link to={`/posts/${post._id}`} className="btn sm">View</Link>
                <Link to={`/posts/${post._id}/edit`} className="btn sm primary">Edit</Link>
                <DeletePost postId={post._id} />
              </div>
            </article>
          ))}
        </div>:
        <h2 className="center">You have no posts yet.</h2>
      }      
    </section>

  )
}

export default DashBoard