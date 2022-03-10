import {MigrationInterface, QueryRunner} from "typeorm";

export class test1646777051873 implements MigrationInterface {
    name = 'test1646777051873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`level\` int NOT NULL, \`label\` varchar(255) NOT NULL, PRIMARY KEY (\`level\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(45) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`profileId\` int NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`REL_9466682df91534dd95e4dbaa61\` (\`profileId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`displayname\` varchar(50) NULL, \`bio\` varchar(300) NULL DEFAULT '', \`profile_picture\` varchar(300) NULL DEFAULT '', \`background_picture\` varchar(300) NULL DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_role\` (\`userId\` int NOT NULL, \`roleLevel\` int NOT NULL, INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` (\`userId\`), INDEX \`IDX_c8f6a99d99952cb0edb1b61fda\` (\`roleLevel\`), PRIMARY KEY (\`userId\`, \`roleLevel\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_9466682df91534dd95e4dbaa616\` FOREIGN KEY (\`profileId\`) REFERENCES \`profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_ab40a6f0cd7d3ebfcce082131fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_c8f6a99d99952cb0edb1b61fda4\` FOREIGN KEY (\`roleLevel\`) REFERENCES \`role\`(\`level\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_c8f6a99d99952cb0edb1b61fda4\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_ab40a6f0cd7d3ebfcce082131fd\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_9466682df91534dd95e4dbaa616\``);
        await queryRunner.query(`DROP INDEX \`IDX_c8f6a99d99952cb0edb1b61fda\` ON \`user_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` ON \`user_role\``);
        await queryRunner.query(`DROP TABLE \`user_role\``);
        await queryRunner.query(`DROP TABLE \`profile\``);
        await queryRunner.query(`DROP INDEX \`REL_9466682df91534dd95e4dbaa61\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
