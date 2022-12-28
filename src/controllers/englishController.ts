import { ObjectId } from "mongodb";
import EnglishInjector from "../injectors/englishInjector";

class EnglishController {
    enInjector;

    constructor(enInjector: typeof EnglishInjector) {
        this.enInjector = enInjector;
    }

    async addWord(
        word: string,
        ptWords: ObjectId[],
        categories: ObjectId[] = []
    ) {
        const englishWord = this.enInjector.makeWord(word, ptWords, categories);

        return await this.enInjector.addWord(englishWord);
    }

    async getWordId(word: string) {
        return await this.enInjector.getWordId(word);
    }

    async updateWord(
        enWordSearch: string,
        { update }: { update: string },
        categoriesToAdd: ObjectId[]
    ) {
        const updatedTranslation = await this.enInjector.updateWord(
            enWordSearch,
            update,
            categoriesToAdd
        );

        if (updatedTranslation.modifiedCount === 0)
            return `${enWordSearch} is not registered.`;

        return `${enWordSearch} updated.`;
    }

    async appendTranslation(enWordId: ObjectId, ptWordId: ObjectId) {
        const updatedTranslation = await this.enInjector.appendTranslation(
            enWordId,
            ptWordId
        );

        if (updatedTranslation.modifiedCount === 0)
            return `Translation already registered.`;

        return `Translation registered.`;
    }

    async queryWord(word: string) {
        const wordFound = await this.enInjector.queryWord(word);

        if (wordFound.length) return wordFound[0];

        return "Word not found.";
    }

    async queryWordByCategory(categoryId: ObjectId) {
        return await this.enInjector.queryWordByCategory(categoryId);
    }
}

export default EnglishController;
