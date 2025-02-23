import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
        // jwksUri: `https://dev-qqr1um2mnzvr1ecv.us.auth0.com/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_CLIENT_ID,
      // audience: '4pyTHsfzWSRzpjo65Bau4SEl3Z2zPBvd',
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      // issuer: 'https://dev-qqr1um2mnzvr1ecv.us.auth0.com/',
      algorithms: ['RS256'],
    });
  }

  async validate(payload: object): Promise<any> {
    return payload;
  }
}
