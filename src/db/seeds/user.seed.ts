import faker from '@faker-js/faker';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Follow } from '../../follower/entities/follower.entity';
import stateFromHTML from '../../helpers/helpers';
import { Post } from '../../post/entities/post.entity';
import { Profile } from '../../profile/entites/profile.entity';
import { UserRoles } from '../../role/dto/role.enum';
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
      // .createMany(100);
      .createMany(20);

    const all = [admin, moderator, user, ...randomUsers];

    for (const userI of all) {
      await userI.reload();

      this.generatePost(userI, connection);

      for (const userJ of all) {
        try {
          await this.generateRelations(userI, userJ, connection);
        } catch {
          continue;
        }
      }
    }
  }
  /**
   * Generate user post
   * @param user
   * @param connection
   */
  generatePost = async (user: User, connection) => {
    // prettier-ignore
    const emojis = ["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"]

    let postCount = faker.datatype.number({
      min: 3,
      max: 10,
    });

    for (let i = 0; i < postCount; i++) {
      let content = '';

      let linesCount = faker.datatype.number({
        min: 1,
        max: 5,
      });

      for (let i = 0; i < linesCount; i++) {
        const randomEmojisCount = faker.datatype.number({
          min: -2,
          max: 3,
        });
        const randomSentenceWords = faker.datatype.number({
          min: 1,
          max: 10,
        });
        const randomEmojis = faker.random.arrayElements(
          emojis,
          randomEmojisCount,
        );
        content += `<p>${faker.lorem.sentence(
          randomSentenceWords,
        )} ${randomEmojis.join('')}<p>`;
      }

      await connection.getRepository(Post).insert({
        user: user,
        draftRaw: JSON.stringify(stateFromHTML(content)),
      });
    }
  };

  generateRelations = async (follower, following, connection) => {
    const random = Math.random();
    const random2 = Math.random();

    await follower.reload();

    if (follower.id === following.id) return;

    // Création des relations entre les utilisateurs
    if (random < 0.5) {
      await connection
        .getRepository(Follow)
        .insert({ followerId: follower.id, followingId: following.id });
    }
    if (random2 < 0.5) {
      await connection
        .getRepository(Follow)
        .insert({ followerId: following.id, followingId: follower.id });
    }
  };
}
