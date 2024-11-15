const {Router} = require("express")
const {register, login, getAuthor, getAuthors, authorAvatar, editAuthor} = require("../Controllers/userController")
const authentificationMiddleware = require("../Midllewares/authentification")

const userRoutes = Router()

userRoutes.post("/register", register)
userRoutes.post("/login", login)
userRoutes.get("/:id", getAuthor)
userRoutes.get("/", getAuthors)
userRoutes.post("/change-avatar", authentificationMiddleware, authorAvatar)
userRoutes.patch("/edit", authentificationMiddleware, editAuthor)



module.exports = userRoutes