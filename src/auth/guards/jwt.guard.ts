import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../dto/public.decorator';

@Injectable()
export class JwtAuthGard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // On recupere la metadonnée du décorateur -> @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si public alors un user non authentifié peut accéder a la ressource
    if (isPublic) {
      return true;
    }

    // Sinon on passe le relai au garde suivant
    return super.canActivate(context);
  }

  // Fonction de passport.js qui injecte les données return dans la req.user
  // Qui est ensuite utilisé dans la strategie pour decode le token d'authentification
  // Voir fichier src/auth/strategy/jwt.strategy.ts
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // On recupere l'objet request du context
    const gqlReq = ctx.getContext().req;

    // Important pour que passport.js puisse recuperer le token dans le header authorization de la requete
    // Passport.js fera ensuite req.headers.authorization pour accéder au token
    return gqlReq;
  }
}
