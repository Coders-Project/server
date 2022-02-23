import { UserRoles } from 'src/role/dto/role.enum';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Profile } from '../../profile/entites/profile.entity';
import { User } from './../../user/entities/user.entity';

export default class CreateUser implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.getRepository(User).delete({});

    await factory(User)({
      username: 'admin',
      email: 'admin@admin.com',
      role: UserRoles.Admin,
    })
      .map(async (user) => {
        user.profile = await factory(Profile)().create();
        return user;
      })
      .create();

    await factory(User)({
      username: 'moderator',
      email: 'moderator@moderator.com',
      role: UserRoles.Moderator,
    })
      .map(async (user) => {
        user.profile = await factory(Profile)().create();
        return user;
      })
      .create();

    await factory(User)({
      username: 'user',
      email: 'user@user.com',
      role: UserRoles.User,
    })
      .map(async (user) => {
        user.profile = await factory(Profile)().create();
        return user;
      })
      .create();

    await factory(User)({
      role: UserRoles.User,
    })
      .map(async (user) => {
        user.profile = await factory(Profile)().create();
        return user;
      })
      .createMany(30);
  }
}
