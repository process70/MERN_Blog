const HttpError = require("../Modals/errorModal");
const User = require("../Modals/userModal")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {v4: uuid} = require("uuid")
const path = require("path")
const fs = require("fs")
const { v2 : cloudinary } = require("cloudinary");

/* =====================REGISTER===================== */

const register = async (req, res, next) => {
    try {
        const{name, email, password, password2} = req.body;
    
        if(!name || !email || !password || !password2) 
                return next(new HttpError("Fill in all Fields . ", 422))
    
        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({email: newEmail})

        if(emailExists) 
                return next(new HttpError("Email already exists.", 422))

        if(password.trim().length < 6)   // remove whitespace from both ends of a string
                return next(new HttpError("password should be at least 6 caracters.", 422))

        if(password != password2)
                return next(new HttpError("password do not match.", 422))
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User(req.body)
        user.email = newEmail;
        user.password = hashPassword;
        console.log("the new user: "+user)
        user.save().then(result => res.json(result))

    } catch (error) {
        return next(new HttpError("user registration failed. ", 422))
    }
}


/* =====================LOGIN===================== */

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) return next(new HttpError("Fill in All Fields", 422))
        const newEmail = email.toLowerCase();
        const user = await User.findOne({email: newEmail});
        if(!user) return next(new HttpError("Invalid Email Adrress, check your Email", 422))
        const comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword) return next(new HttpError("Password Incorrect, Check it again"))
        const {_id: id, name} = user

        const token = jwt.sign({id, name}, process.env.JWT_SECRET, {expiresIn: "1d"})
        res.status(200).json({
            token: token,
            id: id,
            name: name
        }); 
        
    } catch (error) {
        return next(new HttpError("user login failed. ", 422))
    }
}


/* =====================GET AUTHOR   /blog/users/id===================== */

const getAuthor = async (req, res, next) => {
    try {
        const {id} = req.params   //destruct id from path parameters
        const user = await User.findById(id)  // get the author without password
        if(!user) return next(new HttpError("User not found", 404))
        res.status(200).json(user)

    } catch (error) {
        return next(new HttpError(error))
    }
}


/* =====================GET ALL AUTHORS  /blog/users/===================== */

const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find()
        res.status(200).json(authors)
    } catch (error) {
        return next(error)
    }
}

/* =====================EDIT AUTHOR AVATAR===================== */

const authorAvatar = async (req, res, next) => {
    try {
            console.log("current logged in author id: "+req.user.id)
            const {avatar} = req.files; //avatar is the name of form-data request body 
            if(!avatar) {
                return next(new HttpError("Please choose an image.", 422))
            }
            console.log("uploaded file name: "+avatar.name)

            // find user from database
            const user = await User.findById(req.user.id);
            
            if(user.avatar) {
                // delete old avatar file if exists
/*                 fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) =>{
                    if(err)  return next(new HttpError("error occured while deleting the file"))
                }) */
                try {
                    const result = await cloudinary.uploader.destroy(
                        `BLOG_Images/${user.avatar.split("/").pop().split(".")[0]}`, {
                            invalidate: true,
                            resource_type: "image"
                        });
                } catch (error) {
                    console.error('Cloudinary delete image error:', error);
                    // return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
                    return next(new HttpError("Delete uploaded images failed " + error.message ), 500)
                }
            }
/* 			console.log("avatar property does not exist on the collection")
                        // check file size
            if(avatar.size > 5000000) {   //500KB
                return next(new HttpError("Profile picture too big. Should be less than 500kb"), 422)
            }
            // to prevent have the same file name in uploads diretory
            let fileName = avatar.name;
            let splittedFilename = fileName.split(".")
            let newFilename = splittedFilename[0] + '.' + uuid() + '.' + splittedFilename[splittedFilename.length - 1]
            
            avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                if (err) return next(new HttpError("error occured while deleting the file"))                
            }) */
                let profileImagePath = ''
                try {
                  // Upload new image
                  const result = await cloudinary.uploader.upload(avatar.tempFilePath, {
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
		    
			const avatarUpdated = await User.findByIdAndUpdate(user.id, {avatar: profileImagePath}, {new: true})
			// avatarUpdated will contain the new updated author detail
			if(avatarUpdated) res.status(200).json(avatarUpdated)
            else return next(new HttpError("error occured while updating the authors's avatar"))
  
    } catch (error) {
        return next("unknown error occured from try catch")
    }
}


/* =====================EDIT AUTHOR===================== */

const editAuthor = async (req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
        
        const getUser = await User.findById(req.user.id);
        //test if the author is logged in or not
        if(!getUser) return next(new HttpError("User not Found, try to log in", 422))

        if(getUser.email != email) return next(new HttpError("Email does not exist", 422))

        const validate = await bcrypt.compare(currentPassword, getUser.password);
        
        if(!validate) return next(new HttpError("Invalid current password", 422))

        if(newPassword !== confirmNewPassword) return next(new HttpError("passwords do not match", 422))

        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(newPassword, salt);
        const editedUser = await User.findByIdAndUpdate(req.user.id, {email, name, password: hasedPassword})
        res.status(200).json(editedUser)

    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = {register, login, getAuthor, getAuthors, authorAvatar, editAuthor}
