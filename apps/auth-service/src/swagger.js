const swaggerAutoGen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Hamsoya Auth Service',
    description: 'Auth Service for Hamsoya',
    version: '1.0.0',
  },
  host: 'localhost:5001',
  basePath: '/api',
  schemes: ['http'],
};

const outputFile = './apps/auth-service/src/swagger_output.json';
const endpointsFiles = ['./apps/auth-service/src/routes/auth.routes.ts'];

swaggerAutoGen(outputFile, endpointsFiles, doc);
