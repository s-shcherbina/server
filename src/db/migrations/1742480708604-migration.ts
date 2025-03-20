import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742480708604 implements MigrationInterface {
    name = 'Migration1742480708604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company_actions" ADD "rating" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "rating" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "company_actions" DROP COLUMN "rating"`);
    }

}
