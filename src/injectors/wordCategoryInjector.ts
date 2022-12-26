import WordCategory from "../models/WordsCategory";
import WordCategoryService from "../services/wordCategoryService";
import db from "../config/db";

class WordCategoryInjector {
    static makeCategory(category: string) {
        return new WordCategory(category);
    }

    static addCategory(category: WordCategory) {
        const wrdCtgrService = new WordCategoryService(
            db.collection("categories")
        );

        return wrdCtgrService.addCategory(category);
    }

    static queryCategories() {
        const wrdCtgrService = new WordCategoryService(
            db.collection("categories")
        );

        return wrdCtgrService.queryCategories();
    }

    static updateCategory(searchValue: string, newValue: string) {
        const wrdCtgrService = new WordCategoryService(
            db.collection("categories")
        );

        return wrdCtgrService.updateCategory(searchValue, newValue);
    }

    static deleteCategory(category: string) {
        const wrdCtgrService = new WordCategoryService(
            db.collection("categories")
        );

        return wrdCtgrService.deleteCategory(category);
    }
}

export default WordCategoryInjector;
