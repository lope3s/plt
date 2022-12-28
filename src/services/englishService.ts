import { Collection, Document, ObjectId } from "mongodb";
import EnglishWord from "../models/EnglishWord";

class EnglishService {
    coll;

    constructor(coll: Collection<Document>) {
        this.coll = coll;
    }

    async addWord(enWord: EnglishWord) {
        //Business logic
        const wordAlreadyRegistered = await this.coll.findOne({
            word: enWord.word,
        });

        if (wordAlreadyRegistered) return null;

        //Service logic
        const englishInsertedId = await this.coll.insertOne(enWord);

        return { _id: englishInsertedId.insertedId, ...enWord };
    }

    async getWordId(enWord: string) {
        return this.coll.findOne({
            word: enWord.toLowerCase(),
        });
    }

    async updateWord(
        enWordSearch: string,
        enWord: string,
        categoriesToAdd: ObjectId[]
    ) {
        return await this.coll.updateOne(
            {
                word: {
                    $regex: enWordSearch,
                    $options: "i",
                },
            },
            {
                $set: {
                    word: enWord.toLowerCase(),
                },
                $addToSet: {
                    categories: { $each: categoriesToAdd },
                },
            }
        );
    }

    async appendTranslation(enWordId: ObjectId, ptWordId: ObjectId) {
        return await this.coll.updateOne(
            {
                _id: enWordId,
            },
            {
                $addToSet: {
                    ptWords: ptWordId,
                },
            }
        );
    }

    async queryWord(word: string) {
        return await this.coll
            .aggregate([
                {
                    $match: {
                        word: word.toLowerCase(),
                    },
                },
                {
                    $lookup: {
                        from: "ptWords",
                        localField: "ptWords",
                        foreignField: "_id",
                        as: "ptWords",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        ptWords: {
                            _id: 0,
                        },
                    },
                },
            ])
            .toArray();
    }

    async queryByCategory(categoryId: ObjectId) {
        return this.coll
            .find({
                categories: categoryId,
            })
            .toArray();
    }
}

export default EnglishService;
