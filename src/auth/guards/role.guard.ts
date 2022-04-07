import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRoles } from '../../role/dto/role.enum';
import { User } from '../../user/entities/user.entity';
import { ROLES_KEY } from '../dto/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // TODO :  check pourquoi il ne fonctionne pas sur les resolveField()
  canActivate(context: ExecutionContext): boolean {
    // On recupere les metadonnée du décorateur -> @Roles()
    // Ex : @Roles(UserRoles.Moderator) -> on va donc recuperer la valeur ici
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si aucun role requis alors on desactive le role guard
    // -> Le user peut donc accéder a la ressource
    if (!requiredRoles) {
      return true;
    }

    // On recupere le user dans l'objet request
    const user: User =
      GqlExecutionContext.create(context).getContext().req.user;

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
