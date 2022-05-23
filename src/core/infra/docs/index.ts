import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './apiSpec'

export const setSwaggerUi = (app: any) =>{
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} 