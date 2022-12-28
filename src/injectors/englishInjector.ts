import { ObjectId } from "mongodb";
import db from "../config/db";
import EnglishWord from "../models/EnglishWord";
import EnglishService from "../services/englishService";

class EnglishInjector {
    static makeWord(
        word: string,
        ptWords: ObjectId[],
        categories: ObjectId[] = []
    ) {
        return new EnglishWord(word, ptWords, categories);
    }

    static async addWord(enWord: EnglishWord) {
        const enService = new EnglishService(db.collection("enWords"));

        return await enService.addWord(enWord);
    }

    static async getWordId(enWord: string) {
        const enService = new EnglishService(db.collection("enWords"));

        return await enService.getWordId(enWord);
    }

    static async updateWord(
        enWordSearch: string,
        enWord: string,
        categoriesToAdd: ObjectId[]
    ) {
        const enService = new EnglishService(db.collection("enWords"));
        return await enService.updateWord(
            enWordSearch,
            enWord,
            categoriesToAdd
        );
    }

    static async appendTranslation(enWordId: ObjectId, ptWordId: ObjectId) {
        const enService = new EnglishService(db.collection("enWords"));
        return await enService.appendTranslation(enWordId, ptWordId);
    }

    static async queryWord(word: string) {
        const enService = new EnglishService(db.collection("enWords"));
        return await enService.queryWord(word);
    }

    static async queryWordByCategory(categoryId: ObjectId) {
        const ptService = new EnglishService(db.collection("enWords"));
        return await ptService.queryByCategory(categoryId);
    }
}

export default EnglishInjector;
