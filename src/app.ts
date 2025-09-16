import express, {Request, Response, NextFunction} from 'express';
import createError from "http-errors";
import path from 'path';
import cors from 'cors';
import productsRouter from './routes/v1/products.route';
import categoriesRouter from './routes/v1/categories.route';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

//Cấu hình thư mục tĩnh
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/categories', categoriesRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello, World! This is a TypeScript Express API.',
  })
});

// Handle 404 Not Found
app.use((req, res, next)=>{
  next(createError(404, 'Not Found'));
});
// Handle errors 
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('<<=== 🚀 err.stack ===>>',err.stack);
  // Set the status code to the error status or 500 if not set
  res.status(err.status || 500);
  res.json({
    statusCode: err.status || 500,
    message: err.message || 'Internal Server Error',
    data: null
  });
});

export default app;
