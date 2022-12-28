import { ObjectId } from "mongodb";
import db from "../config/db";
import PortugueseWord from "../models/PortugueseWord";
import PortugueseService from "../services/portugueseService";

class PortugueseInjector {
    static makeWord(ptWord: string, categories: ObjectId[] = []) {
        return new PortugueseWord(ptWord, categories);
    }

    static async addWord(ptWord: PortugueseWord) {
        const ptService = new PortugueseService(db.collection("ptWords"));
        return await ptService.addWord(ptWord);
    }

    static async getWordId(ptWord: string) {
        const ptService = new PortugueseService(db.collection("ptWords"));
        return await ptService.getWordId(ptWord);
    }

    static async updateWord(
        ptWordSearch: string,
        ptWordUpdate: string,
        categoriesToAdd: ObjectId[]
    ) {
        const ptService = new PortugueseService(db.collection("ptWords"));
        return await ptService.updateWord(
            ptWordSearch,
            ptWordUpdate,
            categoriesToAdd
        );
    }

    static async queryWord(word: string) {
        const ptService = new PortugueseService(db.collection("ptWords"));
        return await ptService.queryWord(word);
    }

    static async queryWordByCategory(categoryId: ObjectId) {
        const ptService = new PortugueseService(db.collection("ptWords"));
        return await ptService.queryByCategory(categoryId);
    }
}

export default PortugueseInjector;
