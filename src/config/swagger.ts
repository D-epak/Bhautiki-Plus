import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import logger from './logger';

export function setupSwagger(app: express.Application) {
  try {
    const specPath = path.join(process.cwd(), 'openapi.yaml');
    const spec = YAML.load(specPath);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
    logger.info('Swagger UI available at /docs');
  } catch (err) {
    logger.warn('Could not load openapi.yaml for /docs route:', err);
  }
}

export default setupSwagger;
