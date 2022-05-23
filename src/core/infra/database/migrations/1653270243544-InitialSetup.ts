import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialSetup1653270243544 implements MigrationInterface {
    name = 'InitialSetup1653270243544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("userid" SERIAL NOT NULL, "username" character varying(36) NOT NULL, "password" character varying(36) NOT NULL, CONSTRAINT "PK_755ac9fbd440bc9b97fe9532108" PRIMARY KEY ("userid"))`);
        await queryRunner.query(`CREATE TABLE "note" ("uid" uuid NOT NULL, "title" character varying NOT NULL, "details" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userid" integer, CONSTRAINT "PK_3551677293cd7eb611d99142c07" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_e998e58b6b39e15110780c9ee29" FOREIGN KEY ("userid") REFERENCES "user"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_e998e58b6b39e15110780c9ee29"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
