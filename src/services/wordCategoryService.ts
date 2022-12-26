import { Collection, Document } from "mongodb";
import WordCategory from "../models/WordsCategory";

class WordCategoryService {
    coll;

    constructor(coll: Collection<Document>) {
        this.coll = coll;
    }

    async addCategory(wordCategory: WordCategory) {
        const categoryAlreadyRegistered = await this.coll.findOne({
            category: wordCategory.category,
        });

        if (categoryAlreadyRegistered) return null;

        const categoryInsertedId = await this.coll.insertOne(wordCategory);

        return { _id: categoryInsertedId.insertedId, ...wordCategory };
    }

    async updateCategory(categorySearch: string, newCategoryValue: string) {
        const updatedWordCategory = await this.coll.updateOne(
            {
                category: categorySearch,
            },
            {
                $set: {
                    category: newCategoryValue,
                },
            }
        );

        if (!updatedWordCategory.modifiedCount)
            return `${categorySearch} not found.`;

        return `${categorySearch} updated to ${newCategoryValue}.`;
    }

    async deleteCategory(category: string) {
        const deletedCategory = await this.coll.deleteOne({
            category: category,
        });

        if (!deletedCategory.deletedCount) return `${category} not registered.`;

        return `${category} deleted.`;
    }

    async queryCategories() {
        return await this.coll
            .find(
                {},
                {
                    projection: {
                        _id: 0,
                    },
                }
            )
            .toArray();
    }
}

export default WordCategoryService;
