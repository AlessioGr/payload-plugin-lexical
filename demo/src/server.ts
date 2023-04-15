import express from 'express';
import payload from 'payload';

require('dotenv').config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

// Initialize Payload asynchronously
const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });


  // Add your own express routes here

  app.listen(3001, async () => {
    console.log(
      'Express is now listening for incoming connections on port 3001.',
    );
  });
};

start();
