import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import Logger from "./logger";
import morganMiddleware from './morgan-middleware';
import cors from 'cors';

import { getScore, getState } from './controllers/get';
import { putScore, putState } from './controllers/put';
import verifyJwt from './controllers/jwt';
import { userCanView, userCanEdit } from './controllers/permissions';
import { validScope, getWorksheet } from './helpers';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app: Express = express();

// I am behind nginx
app.set('trust proxy', 1);
app.set('token-secret', process.env.TOKEN_SECRET);

app.use(morganMiddleware);

app.use(helmet());

// TODO: fix CORS so we are send the correct CORS header based on the :domain
const myCors = cors({
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
});

// preflight for all routes
app.options('*', myCors);
app.use(myCors);

app.get('/domains/:domain/worksheets/:worksheet/users/:user/score',
        verifyJwt, userCanView, validScope('score'), getWorksheet, getScore);
app.get('/domains/:domain/worksheets/:worksheet/users/:user/state',
        verifyJwt, userCanView, validScope('state'), getWorksheet, getState);

app.put('/domains/:domain/worksheets/:worksheet/users/:user/score',
        bodyParser.text(), verifyJwt, userCanEdit, validScope('score'), getWorksheet, putScore);
app.put('/domains/:domain/worksheets/:worksheet/users/:user/state',
        bodyParser.json(), verifyJwt, userCanEdit, validScope('state'), getWorksheet, putState);

app.put('/domains/:domain/worksheets/:worksheet/users/:user/score', verifyJwt, putScore);

app.listen(PORT, () => {
  Logger.debug(`Server running on ${PORT}`);
});

