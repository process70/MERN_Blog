/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/UserContext';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios';

function EditPost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized")
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [error, setError] = useState('')
  const navigate = useNavigate()
  const {currentUser} = useContext(AppContext)
  const token = currentUser?.token

  const {id} = useParams();
  
  useEffect(() => {
    if(!token) navigate("/login")
    getPost()
  }, [navigate, token])

  const getPost = async() => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
    setTitle(response?.data.title)
    setDescription(response?.data.description)
    setCategory(response?.data.category)
    setThumbnail(response?.data.thumbnail)
  }
  
  const modules = {
    toolbar : [  
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ]
  }
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  const POST_CATEGORIES = [
    'Agriculture', 'Investement', 'Art', 'Business', 'Entertainment', 
    'Uncategorized', 'Education', 'Wethear'
  ]

  const editPostHandler = async(e) => {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.set('title', title)
      formData.set('category', category)
      formData.set('description', description)
      formData.set('thumbnail', thumbnail)
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, formData, {
        headers: {Authorization: `Bearer ${token}`}
      })
      if(response) return navigate("/")
      

    } catch (err){
      setError(err.response.data.message)
    }
  }
  
  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
          {error && <p className="form__error-message">{error}</p>}
          <form action="" className="form create-post__form" onSubmit={editPostHandler}>
            <input type="text" placeholder='Title' value={title} 
                  onChange={e => setTitle(e.target.value)} autoFocus/>
            <select name='category' value={category} 
                  onChange={e => setCategory(e.target.value)}> 
              {
                POST_CATEGORIES.map((post_category, index) => (
                  <option key={index} id={category} value={post_category}>{post_category}</option>
                ))
              }
            </select>
            <ReactQuill modules={modules} formats={formats} value={description} 
                      onChange={e => setDescription}/>       
            <input type="file" onChange={e => {setThumbnail(e.target.files[0])}}/>
            <button type="submit" className="btn primary">Update Post</button>
          </form>
      </div>
    </section>
  )
}

export default EditPost