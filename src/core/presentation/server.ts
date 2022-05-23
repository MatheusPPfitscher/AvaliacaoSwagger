import express from 'express';
import cors from 'cors';
import { makeRoutes } from './routes';
import { setSwaggerUi } from '../infra/docs';

export const configureExpressApp = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    makeRoutes(app);

    setSwaggerUi(app);
    
    return app;
};

export const initServer = async (app?: any) => {
    app = app ?? configureExpressApp();

    await app.listen(process.env.PORT, () => console.log("Server is running..."));
};