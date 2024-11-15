import React, { useEffect, useState } from 'react'
import PostItem from './PostItem';
import Loader from './Loader';
import axios from 'axios';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchPosts()     // this function will execute one time 
    }, []);

    if(isLoading) return <Loader />

    const fetchPosts = async() =>{
        setIsLoading(true)
        try {
            console.log("the path :"+`${process.env.REACT_APP_BASE_URL}/posts`)
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`)
            setPosts(response?.data)
            console.log("my posts",posts)
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }
    
    return (
        <section className="posts">
            <div className="container posts__container">
                {
                    posts?.map(({_id: id, thumbnail, category, title, description, creator, createdAt}) => {
                        return (                            
                            <PostItem key={id} postId={id} thumbnail={thumbnail} category={category} title={title} description={description}
                                    creator={creator} created={createdAt}/>                                                    
                        )
                    })
                }
            </div>
        </section>
    )
}

export default Posts