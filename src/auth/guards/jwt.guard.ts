import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

//! Faire la verif des roles dans Dasn le jwrt Guard
//! Faire la verif des roles dans Dasn le jwrt Guard
//! Faire la verif des roles dans Dasn le jwrt Guard

export class JwtAuthGard extends AuthGuard('jwt') {
  // constructor(private reflector: Reflector) {
  //   super();
  // }

  // canActivate(context: ExecutionContext) {
  //   // super.logIn(context.switchToHttp().getRequest());
  //   // return null
  //   const reflector = new Reflector();
  //   // context.
  //   const requiredRoles = reflector.get<UserRoles[]>(
  //     ROLES_KEY,
  //     context.getClass(),
  //   );
  //    // const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
  //   //   ROLES_KEY,
  //   //   [context.getHandler(), context.getClass()],
  //   // );
  //   const user: User = context.switchToHttp().getRequest()?.user;
  //   // if (requiredRoles.some((role) => user.roles?.includes(role))) {
  //   if (!requiredRoles.some((role) => user?.role.id === role)) {
  //     return null;
  //   }
  //   // if (user.role.id ====)
  //   // this.getRequest()
  //   return super.canActivate(context);
  // }

  // handleRequest<User = any>(
  //   err: any,
  //   user: any,
  //   info: any,
  //   context: any,
  //   status?: any,
  // ): User {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext().req;

    return gqlReq;
  }
}
