const express = require("express");
const cors = require("cors");
const {connect} = require("mongoose")
const upload = require("express-fileupload")

require("dotenv").config()

const postRoutes = require ("./Routes/postRoutes")
const userRoutes = require ("./Routes/userRoutes")

const {notFound, errorHandler} = require('./Midllewares/error')

const app = express();

// let our app receive and parse json data(req.body, form data, res.json())
app.use(express.json({
    extended: true
}))
app.use(express.urlencoded({
    extended: true
}))
app.use(cors({   // enabling the cross-origin sharing that will let you connect frontend with backend
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(upload())

//express.static served to the static files like text, images or css files
connect(process.env.MONGO_URI).then((res) => {            
    app.listen(5000, () => {
        console.log("server running on port 5000");
        console.log("connected to the database successfully");
    })
}).catch((err) => console.log("error in connecting to the database :"+err));

//where to save the uploaded files
app.use('/uploads',express.static("uploads"))
app.use("/blog/users", userRoutes)
app.use("/blog/posts", postRoutes)

app.use(notFound);
app.use(errorHandler)
// app.use((req, res, next) => {
//     res.status(404).json({
//         message: "Not Found"+req.originalUrl
//     })
// })

