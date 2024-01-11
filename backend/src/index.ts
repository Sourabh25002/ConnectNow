import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userDetailsRoutes from './routes/userDetails';

const app = express();
const port = process.env.PORT;

// Load environment variables from a .env file
dotenv.config();

// Enable CORS middleware with credentials support
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Parse incoming JSON requests with a size limit of 16kb
app.use(express.json({ limit: "16kb" }));

// Parse incoming URL-encoded requests with a size limit of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse cookies using cookie-parser middleware
app.use(cookieParser());

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

// Use authentication routes defined in the "authRoutes" module
app.use("/auth", authRoutes);

// Use user details routes defined in the "userDetailsRoutes" module
app.use("/userDetails", userDetailsRoutes);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
