import React, { useContext, useEffect, useState } from 'react'
import PostAuthor from '../Components/PostAuthor'
import { Link, useParams } from 'react-router-dom'
import { AppContext } from '../context/UserContext'
import DeletePost from './DeletePost'
import axios from 'axios'
import Loader from '../Components/Loader'


function PostDetail() {
  const {id} = useParams()
  const {currentUser} = useContext(AppContext)

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [creator, setCreator] = useState(null)

  console.log("current user id: "+currentUser)
  console.log("author's post id: "+post?.creator)

  useEffect(() => {
    getPost();
  }, [])

  const getPost = async() => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
      setPost(response.data)
      console.log("post details: "+response.data)
      setCreator(response.data.creator)

    } catch (error) {
      setError(error)
    }
    setLoading(false)  
  }
  if(loading) return <Loader />

  return (
    <section className="post-detail">
      {error && <p className='error'>{error}</p>}
      {post && <div className="container post-detail__container">
        <div className="post-detail__header">
          <PostAuthor creator = {creator} created = {post.createdAt}/>
          {currentUser?.id == post?.creator && <div className="post-detail__buttons">
            <Link to={'/posts/'+post._id+'/edit'} className='btn sm primary'>Edit</Link>
            <DeletePost postId={id} />
          </div>}
        </div>
        <h1>{post?.title}</h1>
        <div className="post-detail__thumbnail">
          <img src = {`$${post?.thumbnail}`} alt="" />
        </div>
      </div>}
    </section>
  )
}

export default PostDetail