import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext().req;
    if (gqlReq) {
      // On récuperer les arguments de la mutation : login
      // input -> car c'est un @InputType()
      const {
        input: { email, password },
      } = ctx.getArgs();
      // L'email et le password sont envoyé au middleware passport-local (par le body de la request)
      gqlReq.body = { email, password };
      return gqlReq;
    }
    return context.switchToHttp().getRequest();
  }
}
