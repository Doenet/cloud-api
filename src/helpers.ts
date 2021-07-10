import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';


export function validScope(scope : String) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const scopes = res.locals.jwt.payload.scope.split(' ');
    if (scopes.indexOf(scope) < 0) {
      res.status(401).send('Not authorized');
      return;    
    }

    next();
  };
}

export async function getWorksheet(req: Request, res: Response, next: NextFunction) {
  const worksheetUrl = req.header('X-Worksheet');
  if (!worksheetUrl) {
    res.status(500).send('Missing X-Worksheet header');
    return;
  }

  const worksheetHash = crypto
        .createHash('sha256')
        .update(worksheetUrl)
        .digest('base64')
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

  if (worksheetHash !== req.params.worksheet) {
    res.status(500).send('Worksheet hash does not match');
    return;
  }

  let domain = (new URL(worksheetUrl)).hostname;
  
  if (domain !== res.locals.jwt.payload.client_id) {
    res.status(401).send('client_id must match the worksheet domain');
    return;
  }

  res.locals.worksheet = {
    url: worksheetUrl,
    hash: worksheetHash
  };
  
  next();
}
