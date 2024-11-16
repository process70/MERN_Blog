import React, { useContext, useEffect, useState } from 'react'
import PostItem from '../Components/PostItem';
import {DUMMY_POSTS} from "../data"
import Loader from '../Components/Loader';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AuthorPosts() {
    const {authorId} = useParams()
    console.log("author id: "+authorId)
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchPosts()        
    }, []);

    
    const fetchPosts = async() =>{
        setIsLoading(true)
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/authors/${authorId}`)
            setPosts(response?.data)
            return;
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }
    
    if(isLoading) return <Loader />

    return (
        <section className="posts">
            <div className="container posts__container">
                {posts?.length > 0 ? 
                    (<> { posts?.map(({_id: id, thumbnail, category, title, description, creator, createdAt}) => {
                            return (                            
                            <PostItem key={id} postId={id} thumbnail={thumbnail} category={category} title={title} description={description}
                                creator={creator} created={createdAt}/>                                                    
                            )
                        })} 
                    </>) : <div>No Posts Available</div>
                }
            </div>
        </section>
    )
}

export default AuthorPosts
