import Faker from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Profile } from '../../profile/entites/profile.entity';

define(Profile, (faker: typeof Faker) => {
  const profile = new Profile();

  const randomBioWords = Faker.datatype.number({
    min: 0,
    max: 3,
  });
  profile.bio = faker.lorem.sentences(randomBioWords);
  profile.displayname = faker.name.findName();

  return profile;
});
