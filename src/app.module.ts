import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Context } from 'graphql-ws';
import { join } from 'path';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/role.guard';
import { ProfileModule } from './profile/profile.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PostMediaModule } from './post-media/post-media.module';
import { PostTagModule } from './post-tag/post-tag.module';
import { TagModule } from './tag/tag.module';
import { PostMentionModule } from './post-mention/post-mention.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      exclude: ['/graphql'],
      rootPath: join(__dirname, '..', 'static'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onConnect: (context: Context<any>) => {
            const { connectionParams, extra } = context;
            console.log(connectionParams);
            // console.log(extra);
            // user validation will remain the same as in the example above
            // when using with graphql-ws, additional context value should be stored in the extra field
            // @ts-ignore
            extra.user = { user: {} };
          },
        },
        // TODO: Ce package est bientôt obsolte, voir une autre façon de faire
        // https://www.apollographql.com/docs/apollo-server/data/subscriptions/#the-graphql-ws-transport-library
        // https://stackoverflow.com/questions/69178586/nestjs-graphql-subscriptions-not-working-with-graphql-ws
        'subscriptions-transport-ws': true,
      },
    }),
    UserModule,
    AuthModule,
    RoleModule,
    ProfileModule,
    PostModule,
    PostMediaModule,
    PostTagModule,
    TagModule,
    PostMentionModule,
  ],
  // On instancie ici les guards qui vont être appelés avant chaque requete
  // -> Authentication Guard (verifie si un user est authentifié)
  // -> Roles Guard (verifie si le user a un role specifique)
  providers: [
    { provide: 'PUB_SUB', useValue: new PubSub() },
    { provide: APP_GUARD, useClass: JwtAuthGard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
