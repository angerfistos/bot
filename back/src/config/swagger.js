const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API BackRapid',
      version: '1.0.0',
      description: 'Documentation de l\'API BackRapid',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // chemin vers les fichiers de routes
};

const specs = swaggerJsdoc(options);
module.exports = specs; 