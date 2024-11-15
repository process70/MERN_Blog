import axios from 'axios'
import TimeAgo from 'javascript-time-ago'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

function PostAuthor({creator, created}) {
  console.log("post author id: "+creator)

  const [author, setAuthor] = useState({})

  useEffect(() => {
    getAuthor()
  }, [])

  const getAuthor = async() => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${creator}`)
      setAuthor(response?.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Link to={'/posts/authors/'+creator} className='post__author'>
        <div className="post__author-avatar">
            <img src={`${process.env.REACT_APP_BASE_URL_ASSESTS}/uploads/${author?.avatar}`} alt="" />
        </div>
        <div className="post__author-details">
            <h5>{author?.name}</h5>
            <small><ReactTimeAgo date = {new Date(created)} locale='en-US' /></small>
        </div>
    </Link>
  )
}

export default PostAuthor