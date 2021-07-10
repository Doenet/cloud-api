import { Request, Response, NextFunction } from 'express';

export async function userCanView(req: Request, res: Response, next: NextFunction) {
  const userId = res.locals.jwt.payload.sub;
  
  if (userId !== req.params.user) {
    // TODO: perhaps some users ARE permitted to view scores of other users?
    console.log(res.locals.jwt,req.params.user);
    res.status(401).send('Not authorized');
    return;
  }

  res.locals.userId = userId;
  next();
}

export async function userCanEdit(req: Request, res: Response, next: NextFunction): Promise<void> {
  return userCanView(req,res,next);
}

