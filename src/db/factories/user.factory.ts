import Faker from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { UserRoles } from '../../role/dto/role.enum';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';

let id = 0;

define(
  User,
  (
    faker: typeof Faker,
    context: { username?: string; email?: string; role?: UserRoles },
  ) => {
    const user = new User();

    user.username = `${context?.username || faker.name.firstName()}${id++}`;
    user.email = context?.email || faker.internet.email();

    if (context?.role) {
      const role = new Role();
      role.level = context.role;
      user.roles = [role];
      // user.roles = role;
    }

    user.password = 'admin';

    return user;
  },
);
