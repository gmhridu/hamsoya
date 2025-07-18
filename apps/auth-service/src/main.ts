import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import router from './routes/auth.routes';
import { AppError, ValidationError } from './utils/errors';

// Enhanced error middleware
const errorMiddleware = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Log the error for debugging
  console.error(`Error ${req.method} ${req.url}:`, {
    message: err.message,
    stack: err.stack,
    name: err.constructor.name,
  });

  // Handle ValidationError first (more specific)
  if (
    err instanceof ValidationError ||
    err.constructor.name === 'ValidationError'
  ) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }

  // Handle other AppError types
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Handle Redis connection errors
  if (err.message.includes('Redis') || err.message.includes('ECONNREFUSED')) {
    console.error('Redis connection error:', err);
    return res.status(503).json({
      status: 'error',
      message: 'Service temporarily unavailable. Please try again later.',
    });
  }

  // Handle database connection errors
  if (err.message.includes('Prisma') || err.message.includes('database')) {
    console.error('Database connection error:', err);
    return res.status(503).json({
      status: 'error',
      message: 'Service temporarily unavailable. Please try again later.',
    });
  }

  // Default to 500 for unhandled errors
  console.error('Unhandled error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

const swaggerDocument = require('./swagger_output.json');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/docs-json', (req, res) => {
  res.json(swaggerDocument);
});

// Routes
app.use('/api', router);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to Hamsoya' });
});

app.use(errorMiddleware);

const port = process.env.PORT || 5001;

const server = app.listen(port, () => {
  console.log(`Auth Service is running at http://localhost:${port}`);
  console.log(`Swagger is running at http://localhost:${port}/api-docs`);
});

server.on('error', (err: any) => {
  console.log('Server Error:', err);
});
