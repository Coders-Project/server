import Faker from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { UserRoles } from '../../role/dto/role.enum';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';

define(
  User,
  (
    faker: typeof Faker,
    context: { username?: string; email?: string; role?: UserRoles },
  ) => {
    const user = new User();
    // faker.
    // const test = [];
    // user.username =
    //   context?.username || faker.unique(() => faker.name.firstName(), test);
    // faker.unique((test) => {
    //   const name = faker.name.firstName();
    //   test.push(name);
    //   return name;
    // });

    user.username = context?.username || faker.name.firstName();
    user.email = context?.email || faker.internet.email();

    if (context?.role) {
      const role = new Role();
      role.id = context.role;
      user.role = role;
    }

    user.password = 'admin';

    return user;
  },
);
