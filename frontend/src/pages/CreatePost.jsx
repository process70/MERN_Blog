/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/UserContext';
import axios from 'axios';

function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized")
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const {currentUser} = useContext(AppContext)
  const token = currentUser?.token
  const id = 5

  useEffect(() => {
    if(!token) navigate("/login")
  }, [navigate, token])
  
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
    'Agriculture', 'Investement', 'Art', 'Business', 'Entertainement', 'Uncategorized', 'Education', 'Wethear'
  ]

  const createPost = async(e) => {
    e.preventDefault()
    const postData = new FormData()
    postData.set('title', title)
    postData.set('category', category)
    postData.set('description', description)
    postData.set('thumbnail', thumbnail)

    console.log("title: "+title)
    console.log("category: "+category)
    console.log("description: "+description)

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/create`, postData, {
        headers: {Authorization: `Bearer ${token}`}
      })
  
      if(response.status === 200) return navigate("/")
    } catch (err) {
        setError(err.response.data.message)
    }
  }
  
  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
          {error && <p className="form__error-message">{error}</p>}
          <form action="" className="form create-post__form" onSubmit={createPost}>
            <input type="text" placeholder='Title' value={title} 
                  onChange={e => setTitle(e.target.value)} autoFocus/>
            <select name='category' value={category} 
                  onChange={e => setCategory(e.target.value)}> 
              {
                POST_CATEGORIES.map(post_category => (
                  <option key={post_category} value={post_category}>{post_category}</option>
                ))
              }
            </select>
            <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription}/>       
            <input type="file" onChange={e => {setThumbnail(e.target.files[0])}}/>
            <button type="submit" className="btn primary">Create Post</button>
          </form>
      </div>
    </section>
  )
}

export default CreatePost