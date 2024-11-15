const {createPost, getPost, getAllPosts, getPostsByCategory, getPostsByAuthor, editPost, deletePost} = 
        require('../Controllers/postContoller')
const authentificationMiddleware = require("../Midllewares/authentification")        
const {Router} = require("express")

const postRoutes = Router()

postRoutes.get("/", getAllPosts)
postRoutes.get("/:id", getPost)
postRoutes.get("/categories/:category", getPostsByCategory)
postRoutes.get("/authors/:author", getPostsByAuthor)
postRoutes.post("/create", authentificationMiddleware, createPost)
postRoutes.patch("/:id", authentificationMiddleware, editPost)
postRoutes.delete("/:id", authentificationMiddleware, deletePost)

module.exports = postRoutes