import { UserRepository } from "../../../../../src/core/infra/database/repositories/db-user-repository";
import { InvalidUsernameError } from "../../../../../src/features/user/domain/errors/empty-username-error";
import { PasswordLengthError } from "../../../../../src/features/user/domain/errors/password-length-error";
import { UserAlreadyExistsError } from "../../../../../src/features/user/domain/errors/user-already-exists-error";
import { UsernameLengthError } from "../../../../../src/features/user/domain/errors/username-length-error";
import { ISignUpParams, SignUpUseCase } from "../../../../../src/features/user/domain/usecases/signup-usecase";

// mock all depedencies
jest.mock("../../../../../src/core/infra/database/repositories/db-user-repository");
const UserRepositoryMock = UserRepository as jest.MockedClass<typeof UserRepository>;

const makeSut = () => {
    const userRepo = new UserRepositoryMock();
    const sut = new SignUpUseCase(userRepo);
    return sut;
};

describe("User feature", () => {
    describe("Sign Up Usecase tests", () => {

        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("Should throw InvalidUsernameError when the username is empty", async () => {
            const testData: ISignUpParams = {
                username: "",
                password: ""
            };

            const sut = makeSut();

            expect(sut.run(testData)).rejects.toThrowError(InvalidUsernameError);
        });

        it("Should throw UsernameLengthError if the Username length is exceeded", () => {
            const testData: ISignUpParams = {
                username: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                password: ""
            };

            const sut = makeSut();

            expect(sut.run(testData)).rejects.toThrowError(UsernameLengthError);
        });

        it("Should throw PasswordLengthError if the password length is exceeded", () => {
            const testData: ISignUpParams = {
                username: "teste",
                password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            };

            const sut = makeSut();
            expect(sut.run(testData)).rejects.toThrowError(PasswordLengthError);
        });

        it("When provided with a valid IUser object, Should throw UserAlreadyExistsError if the UserRepository returns an object", async () => {
            const testData: ISignUpParams = {
                username: "teste",
                password: "teste"
            };

            UserRepositoryMock.prototype.retrieveUserByName.mockResolvedValue({
                ...testData,
                userid: 0,
                notes: []
            });
            // jest.spyOn(UserRepositoryMock.prototype, "retrieveUserByName").mockResolvedValue({
            //     ...testData,
            //     userid: 0,
            //     notes: []
            // });

            const sut = makeSut();

            expect.assertions(1);

            expect(sut.run(testData))
                .rejects
                .toThrowError(UserAlreadyExistsError);
        });

        it("Should return an IUser object when provided with a valid IUser object if username is available", async () => {
            const testData: ISignUpParams = {
                username: "teste",
                password: "teste"
            };

            // UserRepositoryMock.prototype.retrieveUserById.mockResolvedValue(undefined);
            UserRepositoryMock.prototype.createUser.mockResolvedValue({
                username: testData.username,
                userid: 0
            });

            const sut = makeSut();

            expect.assertions(1);

            const result = await sut.run(testData);

            expect(result)
                .toEqual(
                    expect.objectContaining({
                        username: testData.username,
                        userid: 0
                    }));
        });
    });
});