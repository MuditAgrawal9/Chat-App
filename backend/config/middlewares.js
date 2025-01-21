// ./config/middleware.js for Strapi
module.exports = {
  settings: {
    cors: {
      enabled: true,
      origin: ['http://localhost:3000'], // Allow frontend to connect
      methods: ['GET', 'POST'],
    },
  },
};
