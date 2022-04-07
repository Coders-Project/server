import faker from '@faker-js/faker';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Follow } from '../../follower/entities/follower.entity';
import stateFromHTML from '../../helpers/helpers';
import { PostMedia } from '../../post-media/entities/post-media.entity';
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
        return user;
      })
      .create();

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
  generatePost = async (user: User, connection: Connection) => {
    let postCount = faker.datatype.number({
      min: 3,
      max: 10,
    });

    for (let i = 0; i < postCount; i++) {
      const post = new Post();
      post.user = user;
      post.draftRaw = JSON.stringify(stateFromHTML(this.generateContent()));
      post.createdAt = faker.date.between(
        '2010-01-01T00:00:00.000Z',
        '2022-01-01T00:00:00.000Z',
      );

      await post.save();
      await post.reload();

      const recurse = async (currPost: Post, depth: number) => {
        if (depth <= 0) return;

        const repliesCount = faker.datatype.number({ min: 0, max: 10 });

        for (let i = 0; i < repliesCount; i++) {
          const post = new Post();
          post.user = user;
          post.draftRaw = JSON.stringify(stateFromHTML(this.generateContent()));
          post.parent = currPost;
          post.createdAt = faker.date.between(
            currPost.createdAt.toISOString(),
            '2022-01-01T00:00:00.000Z',
          );
          await post.save();
          await post.reload();
          await this.generateMedias(post, connection);
          await recurse(post, depth);
        }

        depth--;
      };

      await recurse(post, faker.datatype.number({ min: 0, max: 5 }));

      await this.generateMedias(post, connection);
    }
  };

  async generateMedias(post: Post, connection: Connection) {
    const mediasCount = faker.datatype.number({
      min: 0,
      max: 4,
    });

    for (let i = 0; i < mediasCount; i++) {
      const randomMedia = faker.datatype.number({
        min: 1,
        max: 4,
      });
      await connection.getRepository(PostMedia).insert({
        path: `/default/post/photo-${randomMedia}.jpg`,
        post: post,
      });
    }
  }

  generateContent() {
    // prettier-ignore
    const emojis = ["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"]

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

    return content;
  }

  generateRelations = async (follower, following, connection) => {
    const random = Math.random();
    const random2 = Math.random();

    await follower.reload();

    if (follower.id === following.id) return;

    try {
      // Création des relations entre les utilisateurs
      if (random < 0.5) {
        await connection
          .getRepository(Follow)
          .insert({ user: follower, following: following });
      }

      if (random2 < 0.5) {
        await connection
          .getRepository(Follow)
          .insert({ user: following, following: follower });
      }
    } catch {
      throw new Error('SEED : Relation already exists');
    }
  };
}
