import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import authRoute from "./routes/auth_route";
import userProfileRoute from "./routes/users_profile_route";
import educationRoute from "./routes/education_route";
import workExperienceRoute from "./routes/work_experience_route";
import projectDetails from "./routes/project_details_route";
import postsRoute from "./routes/posts_route";
import postLikes from "./routes/post_likes_route";
import postComments from "./routes/post_comments_route";
import connections from "./routes/connections_route";

const app = express();
const port = process.env.PORT;

// Load environment variables from a .env file
dotenv.config();

// Enable CORS middleware with credentials support
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Parse incoming JSON requests with a size limit of 16kb
app.use(express.json());

// Parse incoming URL-encoded requests with a size limit of 16kb
app.use(express.urlencoded({ extended: true}));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse cookies using cookie-parser middleware
app.use(cookieParser());


//Self created routes

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});


// Use authentication routes defined in the "authRoute" module
app.use("/auth", authRoute);

// Use user profile routes defined in the "userProfileRoute" module
app.use("/user", userProfileRoute);

// Use education routes defined in the "educationRoute" module
app.use("/edu", educationRoute);

// Use work experience routes defined in the "workExperienceRoute" module
app.use("/work", workExperienceRoute);

app.use("/project", projectDetails);

app.use("/post", postsRoute);

app.use("/like", postLikes);

app.use("/comment", postComments);

app.use("/follow", connections);



// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
