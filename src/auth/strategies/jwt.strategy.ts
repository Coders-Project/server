import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../auth/dto/jwt-payload';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    // Configuration de la jwt-passport strategy
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Après que passport est recupéré le token dans req.headers.authorization ->
  // Si le token est valide (signé avec la bonne secret key / date expiration) passport.js declenche cette fonction
  // On obtient en params le payload du token decodé
  async validate(payload: JwtPayload) {
    // On recupere le user associé a l'id injecté dans le payload du token
    // Passport injecte user dans l'objet 'user' de la request -> req.user
    return this.userService.findOne(payload.userID);
  }
}
