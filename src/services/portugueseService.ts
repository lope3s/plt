import { Collection, Document, ObjectId } from 'mongodb';
import PortugueseWord from '../models/PortugueseWord';

class PortugueseService {
  coll;

  constructor(collection: Collection<Document>) {
    this.coll = collection;
  }

  async addWord(ptWord: PortugueseWord) {
    const wordAlreadyRegistered = await this.coll.findOne({
      ptWord: ptWord.ptWord,
    });

    if (wordAlreadyRegistered) return null;

    const portugueseInsertedId = await this.coll.insertOne(ptWord);

    return { _id: portugueseInsertedId.insertedId, ...ptWord };
  }

  async getWordId(ptWord: string) {
    const portugueseWord = await this.coll.findOne({
      ptWord: ptWord.toLowerCase(),
    });

    return portugueseWord;
  }

  async updateWord(
    ptWordSearch: string,
    ptWordUpdate: string,
    categoriesToAdd: ObjectId[]
  ) {
    return await this.coll.updateOne(
      {
        ptWord: {
          $regex: ptWordSearch,
          $options: 'i',
        },
      },
      {
        $set: {
          ptWord: ptWordUpdate.toLowerCase(),
        },
        $addToSet: {
          categories: { $each: categoriesToAdd },
        },
      }
    );
  }

  async queryWord(word: string) {
    return await this.coll
      .aggregate([
        {
          $match: {
            ptWord: word.toLowerCase(),
          },
        },
        {
          $lookup: {
            from: 'enWords',
            localField: '_id',
            foreignField: 'ptWords',
            as: 'enWords',
          },
        },
        {
          $project: {
            _id: 0,
            enWords: {
              _id: 0,
            },
          },
        },
      ])
      .toArray();
  }
}

export default PortugueseService;
