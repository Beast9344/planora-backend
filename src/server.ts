import app from './app';
import { envVars } from './app/config/env.config';

const port = envVars.PORT || 5000;

// Only spin up the local HTTP listener when running locally in development
if (process.env.NODE_ENV !== 'production') {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
  }
}

// Export the app for Vercel's serverless runtime
export default app;