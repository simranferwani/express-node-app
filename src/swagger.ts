import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  swaggerDefinition: {
    info: {
      title: 'User-Hobby API',
      version: '1.0.0',
      description: 'API for managing users and their hobbies',
    },
    basePath: '/',
  },
  apis: ['./app.ts'], // Replace 'app.ts' with the file that contains your API routes
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
