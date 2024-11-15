/* eslint-disable no-undef */
import React from 'react'
import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'

function PostItem({postId, thumbnail, category, title, description, creator, created}) {

  return (
    <article className="post">
        <div className="post__thumbnail">
            <img src={`${process.env.REACT_APP_BASE_URL_ASSESTS}/uploads/${thumbnail}`} alt={title} />
        </div>
        <div className="post_content">
            <Link to={`/posts/${postId}`}>
                <h3>{title}</h3>
            </Link>
            <p dangerouslySetInnerHTML={{__html: description.substr(0, 100)}} />
            <div className="post__footer">
                <PostAuthor creator={creator} created={created}/>
                <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link>
            </div>
        </div>
    </article>
  )
}

export default PostItem