import express from "express";
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import commentRoutes from './routes/comments.js'
import likesRoutes from './routes/likes.js'
import postRoutes from './routes/posts.js'
import cookieParser from "cookie-parser";
import cors from 'cors'
import multer from "multer";
import relationshipRoutes from "./routes/relationships.js"

const app= express();

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
});
app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
}));

app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
  app.post("/api/upload",upload.single("file"),(req,res)=>{
    const file= req.file;
    res.status(200).json(file.filename);
  })


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likesRoutes)
app.use("/api/relationship",relationshipRoutes)



app.listen(5000,() => {
    console.log("Listening on port 5000...")
})