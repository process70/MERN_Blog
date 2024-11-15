import React, { useEffect, useState } from 'react'
import PostItem from '../Components/PostItem';
import Loader from '../Components/Loader';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CategoryPosts() {
  const {category} = useParams()
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
      fetchPosts()        
  }, [category]);

  if(isLoading) return <Loader />

  const fetchPosts = async() => {
      setIsLoading(true)
      try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`)
          setPosts(response?.data)
      } catch (err) {
          console.log(err)
      }
      setIsLoading(false)
  }
  
  return (
      <section className="posts">
        {posts.length > 0 ?
         <div className="container posts__container">
              {posts.length > 0 &&
                  posts.map(({_id: id, thumbnail, category, title, description, creator, createdAt}) => {
                      return (
                          <PostItem key={id} postId={id} thumbnail={thumbnail} category={category} title={title} description={description}
                                  creator={creator} created={createdAt}/>
                      )
                  })
              }
          </div> : <h2>No Posts Found</h2>}
      </section>
  )
}

export default CategoryPosts