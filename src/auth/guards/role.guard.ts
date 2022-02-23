import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRoles } from '../../role/dto/role.enum';
import { User } from '../../user/entities/user.entity';
import { ROLES_KEY } from '../dto/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

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

    // On rajoute les roles en dessous de la hierarchie du role actuel
    // Ex : Le role admin -> obtient egalement le role 'moderator' et 'user'
    const includesRoles = this.cascadeRole(user.roles.map((role) => role.id));

    // On verifie si l'utilisateur a un des roles requis
    // Si oui il est autorisé a accéder a la ressource
    return requiredRoles.some((role) => includesRoles.includes(role));
  }

  cascadeRole(roles: UserRoles[]) {
    const includesRoles = [];
    roles.forEach((role) => {
      if (role === UserRoles.Admin) {
        includesRoles.push(
          UserRoles.Admin,
          UserRoles.Moderator,
          UserRoles.User,
        );
      }
      if (role === UserRoles.Moderator) {
        includesRoles.push(UserRoles.Moderator, UserRoles.User);
      }
      if (role === UserRoles.User) {
        includesRoles.push(UserRoles.User);
      }
    });
    return includesRoles;
  }
}
