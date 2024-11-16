const Post = require('../Modals/postModel')
const User = require('../Modals/userModal')
const HttpError = require('../Modals/errorModal')
const path = require("path")
const fs = require("fs")
const {v4: uuid} = require("uuid")
const { v2 : cloudinary } = require("cloudinary");


/*========================GET POST===================*/
const getPost = async (req, res, next) => {
    try {
        const {id} = req.params
        const getPost = await Post.findById(id)
        if(!getPost) return next(new HttpError("Error while getting the post, check the id", 422))

        res.status(200).json(getPost)
    } catch (error) {
        console.log("error code: "+error.code)
        return next(new HttpError(error))
    }
}

/*========================GET ALL POST===================*/
const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({updatedAt: -1}) // most recent posts come first
        if(!posts) return next(new HttpError("Error occured while fetching the posts", 422))
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

/*========================CREATE POST===================*/
const createPost = async (req, res, next) => {
    try{
        const{title, description, category} = req.body
        if(!title || !description || !category || !req.files) return next(new HttpError("Fill in all fileds .", 422))

        const {thumbnail} = req.files
        const splittedName = thumbnail.name.split('.')
        const newFileName = splittedName[0] + "." +uuid() + "." + splittedName[splittedName.length - 1]
        
/*         thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
            if(err) return next(new HttpError("Unknown Error occured while saving the file", 422))
        
            const createdPost = await Post.create({title, description, category, thumbnail: newFileName, creator: req.user.id})
            if(!createdPost) return next(new HttpError("Error occured while creating a new post", 422))

            const user = await User.findById(req.user.id)

            if(user) {
                const updatedUser = await User.findByIdAndUpdate(req.user.id, {posts: user.posts + 1})
                if(!updatedUser) return next(new HttpError("user updated failed", 422))
            }

            res.status(200).json(createdPost)
        }) */

        /* upload image to cloudinary */
        let profileImagePath = ''
        try {
          // Upload new image
          const result = await cloudinary.uploader.upload(thumbnail.tempFilePath, {
              folder: 'BLOG_Images' // Optional: organize images in folders
          });

          if (!result.secure_url) {
              // return res.status(400).json({ message: "Failed to upload image" });
              return next(new HttpError("Failed to upload image"), 400)
          }

         profileImagePath = result.secure_url;

        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            // return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
            return next(new HttpError("Image upload failed " + uploadError.message ), 500)
        }

        const createdPost = await Post.create({title, description, category, thumbnail: profileImagePath, creator: req.user.id})
        if(!createdPost) return next(new HttpError("Error occured while creating a new post", 422))

        const user = await User.findById(req.user.id)

        if(user) {
            const updatedUser = await User.findByIdAndUpdate(req.user.id, {posts: user.posts + 1})
            if(!updatedUser) return next(new HttpError("user updated failed", 422))
        }

        res.status(200).json(createdPost)
    } catch(error){
        return next(new HttpError(error))
    }
}

/*========================GET POSTS BY CATEGORY===================*/
const getPostsByCategory = async (req, res, next) => {
    try {
        const {category} = req.params
        
        const getPosts = await Post.find({category: category})

        if(getPosts.length === 0) return res.json({message: "no posts found"})

        res.status(200).json(getPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}

/*========================GET POSTS BY AUTHOR===================*/
const getPostsByAuthor = async (req, res, next) => {
    try {
        const {author} = req.params
        const getPostsByAuthors = await Post.find({creator: author})
        if(!getPostsByAuthors) return next(new HttpError('Error occured while getting the author posts', 422))

        if(getPostsByAuthors.length === 0) res.status(204).json({message: "no posts available"})

        res.status(200).json(getPostsByAuthors)
    } catch (error) {
        return next(new HttpError(error))
    }
}

/*========================EDIT POST===================*/
const editPost = async (req, res, next) => {
    // console.log("token: "+req.user.token)
    // console.log("id: "+req.user.id)
    // console.log("name: "+req.user.name)
    try {
        let fileName, splittedFileName, newFileName;
        const {id} = req.params            // that's equal to: const id = req.params.id
        const {title, description, category} = req.body
        
        if(!title || !category || !description) return next(new HttpError("Fill in all fileds.", 422))

        const getPost = await Post.findById(id)
        
        
        if(!req.files){
           const postWithoutFile = await Post.findByIdAndUpdate(id, {title, category, description})
           res.status(200).json(postWithoutFile)
        }
        else{
           const {thumbnail} = req.files
/*            fs.unlink(path.join(__dirname, "..", "uploads", getPost.thumbnail), async(err) => {
                if(err) return next(new HttpError('error occured while deleting the file', 422))
           }) */
          
           /* delete uploaded image */
           try {
            await cloudinary.uploader.destroy(`BLOG_Images/${getPost.thumbnail.split("/").pop().split(".")[0]}`, {
                    invalidate: true,
                    resource_type: "image"
                });
            } catch (error) {
                console.error('Cloudinary delete image error:', error);
                // return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
                return next(new HttpError("Delete uploaded images failed " + error.message ), 500)
            }
           
/*            fileName = thumbnail.name
           splittedFileName = fileName.split('.')
           newFileName = splittedFileName[0] + "." + uuid() + "." + splittedFileName[splittedFileName.length - 1]
           
           thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
               if(err) return next(new HttpError('error in saving the file', 422))  
           }) */

               let profileImagePath = ''
               try {
                 // Upload new image
                 const result = await cloudinary.uploader.upload(thumbnail.tempFilePath, {
                     folder: 'BLOG_Images' // Optional: organize images in folders
                 });
       
                 if (!result.secure_url) {
                     // return res.status(400).json({ message: "Failed to upload image" });
                     return next(new HttpError("Failed to upload image"), 400)
                 }
       
                profileImagePath = result.secure_url;
       
               } catch (uploadError) {
                   console.error('Cloudinary upload error:', uploadError);
                   // return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
                   return next(new HttpError("Image upload failed " + uploadError.message ), 500)
               }    

           const updatedPost = await Post.findByIdAndUpdate(id, {title, description, category, thumbnail: profileImagePath})
           if(!updatedPost) return next(new HttpError('error in updating the post', 422))

           res.status(200).json(updatedPost)
        }

    } catch (error) {
        return next(new HttpError("error"))
    }
}

/*========================DELETE POST===================*/
const deletePost = async (req, res, next) => {
    try {
        const {id} = req.params
        if(!id) return next(new HttpError("Unavailable post", 422))

        const post = await Post.findById(id)

        //delete the post's file
/*         fs.unlink(path.join(__dirname, "..", "uploads", post.thumbnail), async(err) => {
            if(err) return next(new HttpError("Error occured while deleting the post's thumbnail", 422))
        }) */
            try {
                await cloudinary.uploader.destroy(`BLOG_Images/${post.thumbnail.split("/").pop().split(".")[0]}`, {
                        invalidate: true,
                        resource_type: "image"
                    });
            } catch (error) {
                    console.error('Cloudinary delete image error:', error);
                    // return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
                    return next(new HttpError("Delete uploaded images failed " + error.message ), 500)
            }

        // get the creator
        const getCreator = await User.findById(post.creator);

        //decrement the posts
        const updatedUser = await User.findByIdAndUpdate(post.creator, {posts: getCreator.posts - 1})
        if(!updatedUser) return next(new HttpError("Error occured while updating the author's posts", 422))
        console.log(updatedUser)

        //delete the post
        const deletedPost = await Post.findByIdAndDelete(id)
        if(!deletedPost) return next(new HttpError("Error occured while deleting the post", 422))
        else res.status(200).json(deletedPost)

    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports = {createPost, getPost, getAllPosts, getPostsByCategory, getPostsByAuthor, editPost, deletePost}
