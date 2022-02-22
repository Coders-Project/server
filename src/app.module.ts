import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/role.guard';
import { ProfileModule } from './profile/profile.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
    }),
    UserModule,
    AuthModule,
    RoleModule,
    ProfileModule,
  ],
  // On instancie ici les guards qui vont être appelé avant chaque requete
  // -> Authentication Guard (verifie si un user est authentifié)
  // -> Roles Guard (verifie si le user a un role specifique)
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
