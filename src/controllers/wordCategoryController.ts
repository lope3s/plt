import WordCategoryInjector from "../injectors/wordCategoryInjector";

class WordCategoryController {
    wrdCategoryInjector;

    constructor(wrdCategoryInjector: typeof WordCategoryInjector) {
        this.wrdCategoryInjector = wrdCategoryInjector;
    }

    async addCategory(category: string) {
        const ctgry = this.wrdCategoryInjector.makeCategory(category);

        return await this.wrdCategoryInjector.addCategory(ctgry);
    }

    async queryCategories() {
        return await this.wrdCategoryInjector.queryCategories();
    }

    async updateCategory(searchValue: string, newValue: string) {
        return this.wrdCategoryInjector.updateCategory(searchValue, newValue);
    }

    async deleteCategory(category: string) {
        return await this.wrdCategoryInjector.deleteCategory(category);
    }
}

export default WordCategoryController;
