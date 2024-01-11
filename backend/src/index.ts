import express, { Request, Response, NextFunction} from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';
dotenv.config();
import authRoutes from "./routes/auth";
import userDetailsRoutes from "./routes/userDetails";

const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.use("/auth", authRoutes);
app.use("/userDetails", userDetailsRoutes);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
