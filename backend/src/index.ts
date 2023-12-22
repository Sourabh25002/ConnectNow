import express, { Request, Response, NextFunction} from 'express';

const app = express();
const port = 8001;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.get('/example/b', (req: Request, res: Response, next: NextFunction) => {
  console.log('the response will be sent by the next function ...');
  next();
}, (req: Request, res: Response) => {
  res.send('Hello from B!');
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
