import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { UserRoles } from '../../role/dto/role.enum';
import { Role } from '../../role/entities/role.entity';

export default class CreateRole implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.getRepository(Role).delete({});

    await connection.getRepository(Role).insert({
      level: UserRoles.User,
      label: 'user',
    });
    await connection.getRepository(Role).insert({
      level: UserRoles.Moderator,
      label: 'moderator',
    });
    await connection.getRepository(Role).insert({
      level: UserRoles.Admin,
      label: 'administrator',
    });
  }
}
