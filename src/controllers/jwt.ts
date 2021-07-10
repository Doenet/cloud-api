import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export default async function verifyJwt(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // Handle token presented as a Bearer token in the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, req.app.get('token-secret'), {complete: true}, (err, decoded) => {
      if (err) {
        res.status(401).send(err.message);
        return;
      }

      res.locals.jwt = decoded;
      next();
    });
  } else {
    res.status(401).send('Missing authorization header with bearer token');
  }
}
