import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserRoles } from '../role/dto/role.enum';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
// import { User } from './../@generated/prisma-nestjs-graphql/user/user.model';
import { JwtPayload } from './dto/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const plainPassword = password;
    const hashPassword = user.password;
    const isGoodPassword = await compare(plainPassword, hashPassword);
    if (!isGoodPassword) return null;
    return user;
  }

  login(user: User) {
    const payload: JwtPayload = { userID: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  decodeJwt(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }

  hasAccess(user: User, requiredRoles: UserRoles[]) {
    // On recupere le role du user le plus haut dans la hierarchie
    const maxUserRole = user.roles.sort((a, b) => b.level - a.level)[0].level;
    // On recupere le role requis le plus bas dans la hierarchie
    const minRequiredRole = requiredRoles.sort((a, b) => a - b)[0];

    // On compare les deux roles et verifie si il peut lire la ressource
    // Si vrai il est autorisé a accéder a la ressource
    // return minRequiredRole <= maxUserRole;
    return maxUserRole >= minRequiredRole;
  }
}
