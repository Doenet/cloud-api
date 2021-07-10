import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function getBodySHA256(req: Request, res: Response, buffer: Buffer) {
  const theHash = crypto
        .createHash('sha256')
        .update(buffer)
        .digest('base64')
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

  res.locals.bodyHash = theHash;
};


export async function verifyBodySHA256(req: Request, res: Response, next: NextFunction) {
  const header = req.header('X-Body-SHA256');

  console.log('theHeader',header);
  console.log('bodyHash',res.locals.bodyHash);
  
  if (res.locals.bodyHash !== header) {
    res.status(500).send('X-Body-SHA256 does not match SHA256(req.body)');
    return;        
  }
  
  next();
}

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
