import { describe, it, expect, jest } from "@jest/globals";
import EnglishController from "../../controllers/englishController";
import { ObjectId } from "mongodb";

describe("Testing English Controller", () => {
    const enInjector: any = {
        makeWord: jest.fn((word: string, ptWords: ObjectId[]) => ({
            word,
            ptWords,
        })),
        addWord: jest.fn(async (data: object) => null),
        getWordId: jest.fn(async (word: string) => ({
            _id: new ObjectId("6373f2215d8b936b5cd29661"),
            word,
            ptWords: [],
        })),
        updateWord: jest.fn(async (enWordSearch: string, enWord: string) => ({
            acknowledged: true,
            matchedCount: 0,
            modifiedCount: 0,
            upsertedCount: 0,
            upsertedId: null,
        })),
        appendTranslation: jest.fn(
            async (enWordId: ObjectId, ptWordId: ObjectId) => ({
                acknowledged: true,
                matchedCount: 0,
                modifiedCount: 0,
                upsertedCount: 0,
                upsertedId: null,
            })
        ),
        queryWord: null,
        queryWordByCategory: jest.fn(async (categoryId: ObjectId) => []),
    };

    const englishController = new EnglishController(enInjector);

    describe("Testing addWord method", () => {
        it("Should call injector makeWord and addWord method", async () => {
            await englishController.addWord("feet", []);

            expect(enInjector.makeWord).toBeCalledTimes(1);
            expect(enInjector.makeWord).toBeCalledWith("feet", [], []);
            expect(enInjector.addWord).toBeCalledTimes(1);
            expect(enInjector.addWord).toBeCalledWith({
                word: "feet",
                ptWords: [],
            });
        });

        it("Should return the response from the service", async () => {
            const data = await englishController.addWord("feet", []);

            expect(data).toBe(null);
        });
    });

    describe("Testing getWordId method", () => {
        it("Shoud call the inject getWordId method", async () => {
            await englishController.getWordId("HAND");

            expect(enInjector.getWordId).toBeCalledTimes(1);
            expect(enInjector.getWordId).toBeCalledWith("HAND");
        });

        it("Should return the service data", async () => {
            const data = await englishController.getWordId("hand");

            expect(data).toStrictEqual({
                _id: new ObjectId("6373f2215d8b936b5cd29661"),
                word: "hand",
                ptWords: [],
            });
        });
    });

    describe("Testing updateWord method", () => {
        it("Should call the injector updateWord method", async () => {
            await englishController.updateWord("hand", { update: "handy" }, []);

            expect(enInjector.updateWord).toBeCalledTimes(1);
            expect(enInjector.updateWord).toBeCalledWith("hand", "handy", []);
        });

        it("Should return a string telling if item was not updated", async () => {
            const data = await englishController.updateWord(
                "hand",
                {
                    update: "handy",
                },
                []
            );

            expect(data).toStrictEqual(`hand is not registered.`);
        });

        it("Should return a string telling if item was updated", async () => {
            enInjector.updateWord = jest.fn(
                async (enWordSearch: string, enWord: string) => ({
                    acknowledged: true,
                    matchedCount: 0,
                    modifiedCount: 1,
                    upsertedCount: 0,
                    upsertedId: null,
                })
            );

            const data = await englishController.updateWord(
                "hand",
                {
                    update: "handy",
                },
                []
            );

            expect(data).toStrictEqual(`hand updated.`);
        });
    });

    describe("Testing appendTranslation method", () => {
        it("Should call the injector appendTranslation method", async () => {
            const enObjId = new ObjectId();
            const ptObjId = new ObjectId();

            await englishController.appendTranslation(enObjId, ptObjId);

            expect(enInjector.appendTranslation).toBeCalledTimes(1);
            expect(enInjector.appendTranslation).toBeCalledWith(
                enObjId,
                ptObjId
            );
        });

        it("Should return a string telling that the translation is already registered", async () => {
            const data = await englishController.appendTranslation(
                new ObjectId(),
                new ObjectId()
            );

            expect(data).toBe("Translation already registered.");
        });

        it("Should return a string telling if the translation was appended", async () => {
            enInjector.appendTranslation = jest.fn(
                async (enWordId: string, ptWordId: string) => ({
                    acknowledged: true,
                    matchedCount: 0,
                    modifiedCount: 1,
                    upsertedCount: 0,
                    upsertedId: null,
                })
            );

            const data = await englishController.appendTranslation(
                new ObjectId(),
                new ObjectId()
            );

            expect(data).toBe("Translation registered.");
        });
    });

    describe("Testing queryWord method", () => {
        it("Should call the injector queryWord method", async () => {
            enInjector.queryWord = jest.fn(async () => []);
            await englishController.queryWord("ground");

            expect(enInjector.queryWord).toBeCalledTimes(1);
            expect(enInjector.queryWord).toBeCalledWith("ground");
        });

        it("Should return a string telling that the word was not found if the service return a 0 length array", async () => {
            enInjector.queryWord = jest.fn(async () => []);
            const result = await englishController.queryWord("ground");

            expect(result).toBe("Word not found.");
        });

        it("Should return the first value of the array returned by the injector if the word is registered", async () => {
            enInjector.queryWord = jest.fn(async () => [
                {
                    word: "ground",
                    ptWords: [
                        {
                            ptWord: "chão",
                        },
                    ],
                },
            ]);

            const result = await englishController.queryWord("ground");

            expect(result).toStrictEqual({
                word: "ground",
                ptWords: [
                    {
                        ptWord: "chão",
                    },
                ],
            });
        });
    });

    describe("Testing queryWordByCategory", () => {
        it("Should call the queryWordByCategory method", async () => {
            const categoryId = new ObjectId();
            await englishController.queryWordByCategory(categoryId);

            expect(enInjector.queryWordByCategory).toBeCalledTimes(1);
            expect(enInjector.queryWordByCategory).toBeCalledWith(categoryId);
        });

        it("Should return the same result as the injector", async () => {
            const categoryId = new ObjectId();
            const words = await englishController.queryWordByCategory(
                categoryId
            );

            expect(words).toStrictEqual([]);
        });
    });
});
