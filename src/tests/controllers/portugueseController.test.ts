import { describe, it, afterEach, expect, jest } from "@jest/globals";
import PortugueseController from "../../controllers/portugueseController";

describe("Testing portugueseController", () => {
    const ptInjector: any = {
        makeWord: jest.fn((ptWord: string) => ({ ptWord })),
        addWord: jest.fn(),
        getWordId: jest.fn((ptWord: string) => ({
            ptWord,
        })),
        updateWord: jest.fn(async (enWordSearch: string, enWord: string) => ({
            acknowledged: true,
            matchedCount: 0,
            modifiedCount: 0,
            upsertedCount: 0,
            upsertedId: null,
        })),
        queryWord: null,
    };

    const portugueseController = new PortugueseController(ptInjector);

    afterEach(() => {
        const keys = Object.keys(ptInjector);

        for (const key of keys) {
            ptInjector[key]?.mockClear();
        }
    });

    describe("Testing addWord method", () => {
        it("Should call ptInjector makeWord method", async () => {
            await portugueseController.addWord("teste");

            expect(ptInjector.makeWord).toBeCalledTimes(1);
            expect(ptInjector.makeWord).toBeCalledWith("teste");
        });

        it("Should call ptInjector addWord method", async () => {
            await portugueseController.addWord("teste");

            expect(ptInjector.addWord).toBeCalledTimes(1);
            expect(ptInjector.addWord).toBeCalledWith({ ptWord: "teste" });
        });

        it("Should return the same value as ptInjector addWord method", async () => {
            ptInjector.addWord = jest.fn((queryObj: object) => null);

            const data = await portugueseController.addWord("teste");

            expect(data).toBe(null);
        });
    });

    describe("Testing getWordId method", () => {
        it("Should call ptInjector getWordId method", async () => {
            await portugueseController.getWordId("teste");

            expect(ptInjector.getWordId).toBeCalledTimes(1);
            expect(ptInjector.getWordId).toBeCalledWith("teste");
        });

        it("Should return the same result as the ptInjector getWordId method", async () => {
            const data = await portugueseController.getWordId("teste");

            expect(data).toStrictEqual({ ptWord: "teste" });
        });
    });

    describe("Testing updateWord method", () => {
        it("Should call the ptInjector updateWord method", async () => {
            await portugueseController.updateWord("teste", {
                newValue: "testes",
            });

            expect(ptInjector.updateWord).toBeCalledTimes(1);
            expect(ptInjector.updateWord).toBeCalledWith("teste", "testes");
        });

        it("Should return string telling that word is not registered", async () => {
            const data = await portugueseController.updateWord("teste", {
                newValue: "testes",
            });

            expect(data).toBe("teste is not registered.");
        });

        it("Should return string telling that word was updated", async () => {
            ptInjector.updateWord = jest.fn(
                async (enWordSearch: string, enWord: string) => ({
                    acknowledged: true,
                    matchedCount: 0,
                    modifiedCount: 1,
                    upsertedCount: 0,
                    upsertedId: null,
                })
            );

            const data = await portugueseController.updateWord("teste", {
                newValue: "testes",
            });

            expect(data).toBe("teste updated.");
        });
    });

    describe("Testing queryWord method", () => {
        it("Should call the ptInjector queryWord method", async () => {
            ptInjector.queryWord = jest.fn(async () => []);
            await portugueseController.queryWord("CHÃO");

            expect(ptInjector.queryWord).toBeCalledTimes(1);
            expect(ptInjector.queryWord).toBeCalledWith("CHÃO");
        });

        it("Should return a string telling that the word was not found if no data is returned from the query", async () => {
            ptInjector.queryWord = jest.fn(async () => []);
            const returnedData = await portugueseController.queryWord("CHÃO");

            expect(returnedData).toBe("CHÃO not found.");
        });

        it("Should return the first value returned from the injector if the query return any data", async () => {
            ptInjector.queryWord = jest.fn(async () => [
                { ptWord: "chão", enWords: [{ word: "ground" }] },
            ]);
            const returnedData = await portugueseController.queryWord("CHÃO");

            expect(returnedData).toStrictEqual({
                ptWord: "chão",
                enWords: [{ word: "ground" }],
            });
        });
    });
});
