import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../../role/dto/role.enum';
import { User } from '../../user/entities/user.entity';
import { ROLES_KEY } from '../dto/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user }: { user: User } = context.switchToHttp().getRequest();

    // return requiredRoles.some((role) => user.roles?.includes(role));
    return requiredRoles.some((role) => user.role.id === role);
    // return user.role.id === requiredRoles;
    // return user;
  }
}
