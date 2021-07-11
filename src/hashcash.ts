import { Request, Response, NextFunction } from 'express';
import JWP from 'json-work-proof';

const jwp = new JWP(10);

export default async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  const worksheet = res.locals.worksheet.url;
  const user = res.locals.userId;
  const body = res.locals.bodyHash;

  const token = req.header('X-JSON-Work-Proof');

  try {
    let claims = jwp.decode(token)

    if (claims.sub !== user) {
      res.status(500).send("JWP sub claim does not match JWT sub claim");
      return;
    }

    if (claims.worksheet !== worksheet) {
      res.status(500).send("JWP worksheet claim does not match worksheet header");
      return;
    }

    if (claims.body !== body) {
      res.status(500).send("JWP body claim does not match SHA256(body)");
      return;
    }    

  } catch (e) {
    if (e instanceof JWP.InvalidFormatError) {
      res.status(500).send("JWP formatted incorrectly");
      return;
    } else if (e instanceof JWP.InvalidProofError) {
      res.status(500).send("JWP was not difficult enough");
      return;      
    } else if (e instanceof JWP.ExpiredError) {
      res.status(500).send("JWP has expired or is too new");
      return;      
    } else {
      res.status(500).send(e.toString());
      return;      
    }
  }
  
  next();
}
