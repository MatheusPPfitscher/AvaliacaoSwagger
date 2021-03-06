import { startDatabases, stopDatabases } from "../../../../helpers/handle-databases-for-testing";
import { configureExpressApp } from "../../../../../src/core/presentation/server";
import { clearDatabases } from "../../../../helpers/clean-databases-for-testing";
import request from "supertest";
import { signUpTestUser } from "../../../../helpers/signup-user-for-testing";
import { generateTestToken } from "../../../../helpers/token-generation-for-testing";
import { IEditNoteParams } from "../../../../../src/features/note/domain/usecases/edit-note-usecase";
import { createNoteTester } from "../../../../helpers/create-note-for-testing";

describe("Edit Note Controller Integration tests", () => {
    let app: Express.Application | undefined;

    beforeAll(async () => {
        await startDatabases();
        app = configureExpressApp();
    });

    afterAll(async () => {
        await clearDatabases();
        await stopDatabases();
        app = undefined;
    });

    beforeEach(async () => {
        await clearDatabases();
    });

    test("If request is missing auth header, should return error.msg: ExpiredTokenError", async () => {
        const fakeUid = "UID-QUE-NAO-EXISTE";
        await request(app)
            .put(`/note/${fakeUid}`)
            .send({})
            .expect(401)
            .expect((response) => {
                expect(response.body.msg).toEqual("ExpiredTokenError");
            });
    });

    test("If request is missing note title, should return error.msg: MissingFieldError", async () => {
        const testUser = await signUpTestUser();
        const authTokenForUser = generateTestToken(testUser);

        const testNote = await createNoteTester(testUser);

        const testRequestBody: Partial<IEditNoteParams> = {
            details: "detalhes..."
        };

        await request(app)
            .put(`/note/${testNote!.uid}`)
            .auth(authTokenForUser, { type: "bearer" })
            .send(testRequestBody)
            .expect(400)
            .expect((response) => {
                expect(response.body.msg).toEqual("MissingFieldError");
            });
    });

    test("If request uid do not exist on database, should return error.msg: NoteNotFound", async () => {
        const testUser = await signUpTestUser();
        const authTokenForUser = generateTestToken(testUser);

        const testRequestBody: IEditNoteParams = {
            uid: "Non-Existe-Uid",
            title: "Aquela note",
            details: "que n??o existe"
        };

        await request(app)
            .put(`/note/${testRequestBody!.uid}`)
            .auth(authTokenForUser, { type: "bearer" })
            .send(testRequestBody)
            .expect(404)
            .expect((response) => {
                expect(response.body.msg).toEqual("NoteNotFoundError");
            });
    });

    test("If request is valid, should return msg:NoteEdited", async () => {
        const testUser = await signUpTestUser();
        const authTokenForUser = generateTestToken(testUser);
        const testNote = await createNoteTester(testUser);

        const testRequestBody: Partial<IEditNoteParams> = {
            title: "Aqui temos",
            details: "mais detalhes..."
        };

        await request(app)
            .put(`/note/${testNote!.uid}`)
            .auth(authTokenForUser, { type: "bearer" })
            .send(testRequestBody)
            .expect(200)
            .expect((response) => {
                expect(response.body.msg).toEqual("NoteEdited");
            });
    });
});