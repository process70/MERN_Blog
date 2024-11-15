/* eslint-disable no-undef */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Loader from '../Components/Loader';

function Authors() {

  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getAllAuthors()        
  }, []);

  const getAllAuthors = async() =>{
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`)
      setAuthors(response?.data)
      console.log(response?.data)
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }

  if(isLoading) return <Loader />


  return (
    <section className="authors">
      {
        authors.length > 0 ?
        <div className="container authors__container">
          {
            authors.map(({_id: id, name, posts, avatar})  => (
                <Link key={id} to={`/posts/authors/${id}`} className='author'>
                  <div className="author__avatar">
                    <img src={`${process.env.REACT_APP_BASE_URL_ASSESTS}/uploads/${avatar}`} alt={name} />
                  </div>
                  <div className="author__info">
                    <h4>{name}</h4>
                    <p>{posts}</p>
                  </div>
                </Link>
              )
            )
          }
        </div>: 
        <h2 className='center'>No Authors Found</h2>
      }
    </section>
  )
}

export default Authors