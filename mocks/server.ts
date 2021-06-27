import express from 'express';
import { handlers } from './handlers';
import setupMswMiddleware from './msw/middleware';

// This configures a request mocking server with the given request handlers.
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
setupMswMiddleware(app, handlers);

if(process.env.NODE_ENV != 'test'){
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}.`);
  });
}

export default app;