import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { UserRoles } from '../../role/dto/role.enum';
import { ROLES_KEY } from '../dto/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // On recupere les metadonnées des Roles injectée via le decorateur
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log('user  : ', 'user');
    // return false;
    if (!requiredRoles) {
      return true;
    }
    console.log(requiredRoles);

    // const user: User = context.switchToHttp().getRequest();
    const user: User =
      GqlExecutionContext.create(context).getContext().req.user;
    // console.log('user  : ', context.switchToHttp().getRequest());
    console.log(user);

    // return requiredRoles.some((role) => user.roles?.includes(role));
    // return requiredRoles.some((role) => user?.role.id === role);
    // return user.role.id === requiredRoles;
    // return user;
  }
}
