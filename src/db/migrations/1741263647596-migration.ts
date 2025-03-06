import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741263647596 implements MigrationInterface {
    name = 'Migration1741263647596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "element_id" uuid, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "elemets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP NOT NULL DEFAULT now(), "question" character varying NOT NULL, "quiz_id" uuid, CONSTRAINT "PK_d7d95d4bd7eb6154c549a919bd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP NOT NULL DEFAULT now(), "refresh_token" character varying NOT NULL, "user_id" uuid, CONSTRAINT "REL_9922406dc7d70e20423aeffadf" UNIQUE ("user_id"), CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_actions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP NOT NULL DEFAULT now(), "ownerCompanyVerdict" boolean NOT NULL, "userVerdict" boolean NOT NULL, "role" integer DEFAULT '100', "user_id" uuid, "company_id" uuid, CONSTRAINT "PK_7b32a0edc0d3aeaa7373c4d955e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP NOT NULL DEFAULT now(), "avatar" character varying DEFAULT '', "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "visibility" boolean NOT NULL DEFAULT true, "owner_id" uuid, CONSTRAINT "UQ_463ae1d487e2b708a21c2b4df09" UNIQUE ("title"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quizzes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "company" uuid, CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_companies" ("user_id" uuid NOT NULL, "company_id" uuid NOT NULL, CONSTRAINT "PK_b9b9470d7b8b276b655040d4aec" PRIMARY KEY ("user_id", "company_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ac4c935c0d2e9cbf0b6fe41d25" ON "users_companies" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_986ef3d5c20e949236a2a9d7da" ON "users_companies" ("company_id") `);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_ff415d513d77213ebffc0e23030" FOREIGN KEY ("element_id") REFERENCES "elemets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "elemets" ADD CONSTRAINT "FK_9cba41d04c16f20607d105ab84d" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_9922406dc7d70e20423aeffadf3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_actions" ADD CONSTRAINT "FK_35cfffd29a279c4ed236593d007" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_actions" ADD CONSTRAINT "FK_bd9d081d06e9035763b260b8802" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_df63e1563bbd91b428b5c50d8ad" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD CONSTRAINT "FK_03204425ed8fe15686dbbc346d3" FOREIGN KEY ("company") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_companies" ADD CONSTRAINT "FK_ac4c935c0d2e9cbf0b6fe41d259" FOREIGN KEY ("user_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_companies" ADD CONSTRAINT "FK_986ef3d5c20e949236a2a9d7da9" FOREIGN KEY ("company_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_companies" DROP CONSTRAINT "FK_986ef3d5c20e949236a2a9d7da9"`);
        await queryRunner.query(`ALTER TABLE "users_companies" DROP CONSTRAINT "FK_ac4c935c0d2e9cbf0b6fe41d259"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP CONSTRAINT "FK_03204425ed8fe15686dbbc346d3"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_df63e1563bbd91b428b5c50d8ad"`);
        await queryRunner.query(`ALTER TABLE "company_actions" DROP CONSTRAINT "FK_bd9d081d06e9035763b260b8802"`);
        await queryRunner.query(`ALTER TABLE "company_actions" DROP CONSTRAINT "FK_35cfffd29a279c4ed236593d007"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_9922406dc7d70e20423aeffadf3"`);
        await queryRunner.query(`ALTER TABLE "elemets" DROP CONSTRAINT "FK_9cba41d04c16f20607d105ab84d"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_ff415d513d77213ebffc0e23030"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_986ef3d5c20e949236a2a9d7da"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac4c935c0d2e9cbf0b6fe41d25"`);
        await queryRunner.query(`DROP TABLE "users_companies"`);
        await queryRunner.query(`DROP TABLE "quizzes"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "company_actions"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TABLE "elemets"`);
        await queryRunner.query(`DROP TABLE "answers"`);
    }

}
