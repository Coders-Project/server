import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
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

  // login(user: User) {
  login(user: User) {
    const payload: JwtPayload = { userID: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  decodeJwt(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }
}
// import { BadRequestException, Injectable } from '@nestjs/common';
// import { UserService } from '../user/user.service';
// import { compare } from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(private readonly userService: UserService) {}

//   async validateUser(email: string, password: string) {
//     const user = await this.userService.findByEmail(email);

//     const plainPassword = password;
//     const hashPassword = user?.password;

//     const isGoodPassword = await compare(plainPassword, hashPassword);

//     if (!isGoodPassword || !user) {
//       new BadRequestException();
//     }

//     delete user.password;

//     return user;
//   }
// }
