import express, { Request, Response, NextFunction} from 'express';


const app = express();
const port = 8001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
