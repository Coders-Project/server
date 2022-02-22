import Faker from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Profile } from '../../profile/entites/profile.entity';

define(Profile, (faker: typeof Faker) => {
  const profile = new Profile();

  profile.bio = faker.lorem.sentences(3);
  profile.displayName = faker.name.findName();

  return profile;
});
