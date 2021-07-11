import { Request, Response, NextFunction } from 'express';

import Redis from 'ioredis';
const client = new Redis();

export async function getScore(req: Request, res: Response, next: NextFunction) {
  let score = await client.zscore(`user-score:${res.locals.userId}`, res.locals.worksheet.hash);

  if (score === null) {
    res.json({ score: null });
  } else {
    res.json({ score: parseFloat(score) });
  }
  
  return;
}

export async function getState(req: Request, res: Response, next: NextFunction) {
  let state = await client.getBuffer(`state:${res.locals.userId}:${res.locals.worksheet.hash}`);

  if (state === null) {
    res.json(null);
  } else {
    res.writeHead(200, {'Content-Type': 'application/json', 'Content-Encoding': 'gzip'});
    res.end(state);
  }
  
  return;
}
