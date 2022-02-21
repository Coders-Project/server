import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

//! Faire la verif des roles dans Dasn le jwrt Guard
//! Faire la verif des roles dans Dasn le jwrt Guard
//! Faire la verif des roles dans Dasn le jwrt Guard

export class JwtAuthGard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext().req;

    return gqlReq;
  }
}
