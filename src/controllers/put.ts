import { Request, Response, NextFunction } from 'express';
import zlib from 'zlib';
import crypto from 'crypto';
import util from 'util';
const gzip = util.promisify(zlib.gzip);

import Redis from 'ioredis';
const client = new Redis();

export async function putScore(req: Request, res: Response, next: NextFunction) {
  const score = parseFloat(req.body);

  await client.multi()
    .zadd(`user-score:${res.locals.userId}`, 'GT', score, res.locals.worksheet.hash)
    .zadd(`worksheet-score:${res.locals.worksheet.hash}`, 'GT', score, res.locals.userId)
    .exec();
  
  res.json({ ok: true });

  return;
}

// TODO: it would be cleaner if I were just receiving gzip'd content
// directly from the upstream, but at least this way we can inspect
// the content, make sure it really is JSON-encoded
export async function putState(req: Request, res: Response, next: NextFunction) {
  console.log('bodyHash=',res.locals.bodyHash);
  
  const state = JSON.stringify(req.body);
  const stateBuffer = Buffer.from(state, "utf8");
  const compressed = await gzip(stateBuffer);
  
  await client.setBuffer(`state:${res.locals.userId}:${res.locals.worksheet.hash}`, compressed);

  res.json({ok: true});
  return;
}

