import { UserRoles } from 'src/role/dto/role.enum';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Follow } from '../../follower/entities/follower.entity';
import { Profile } from '../../profile/entites/profile.entity';
import { User } from './../../user/entities/user.entity';

export default class CreateUser implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.getRepository(User).delete({});

    const admin = await factory(User)({
      username: 'admin',
      email: 'admin@admin.com',
      role: UserRoles.Admin,
    })
      .map(async (user) => {
        user.profile = await factory(Profile)().create();

        // await connection
        //   .getRepository(Follow)
        //   .insert({ followerId: 2, followingId: 3 });
        return user;
      })
      .create();

    // await test.save();
    const moderator = await factory(User)({
      username: 'moderator',
      email: 'moderator@moderator.com',
      role: UserRoles.Moderator,
    })
      .map(async (user) => {
        user.profile = await factory(Profile)().create();
        return user;
      })
      .create();

    const user = await factory(User)({
      username: 'user',
      email: 'user@user.com',
      role: UserRoles.User,
    })
      .map(async (user) => {
        user.profile = await factory(Profile)().create();
        return user;
      })
      .create();

    const randomUsers = await factory(User)({
      role: UserRoles.User,
    })
      .map(async (user) => {
        user.profile = await factory(Profile)().create();
        return user;
      })
      // .createMany(500);
      .createMany(100);

    const all = [admin, moderator, user, ...randomUsers];

    // Création des relations entre les utilisateurs
    for (const userI of all) {
      await userI.reload();
      for (const userJ of all) {
        const random = Math.random();
        const random2 = Math.random();
        await userJ.reload();
        if (userJ.id === userI.id) break;

        try {
          if (random < 0.5) {
            await connection
              .getRepository(Follow)
              .insert({ followerId: userJ.id, followingId: userI.id });
          }
          if (random2 < 0.5) {
            await connection
              .getRepository(Follow)
              .insert({ followerId: userI.id, followingId: userJ.id });
          }
        } catch {
          continue;
        }
      }
    }
    // all.forEach(u => {
    //           await connection
    //     .getRepository(Follow)
    //     .insert({ followerId: 2, followingId: 3 });
    // })

    // all.forEach(async (user) => {
    //   await connection.getRepository(User).save(user);
    // }
    // );
  }
}
