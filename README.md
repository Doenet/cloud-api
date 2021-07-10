# doenet.cloud api server

## Routes

All routes expect an `Authorization` header with `Bearer JWT`.

### GET /domains/:domain/worksheets/:worksheet/users/:user/score
### PUT /domains/:domain/worksheets/:worksheet/users/:user/score

## Server configuration

The JWT tokens are signed with
```
TOKEN_SECRET=your-jwt-token-secret
```
