import { describe, it, jest, expect, afterEach } from '@jest/globals';
import { ObjectId, Document, Filter, UpdateFilter } from 'mongodb';
import EnglishService from '../../services/englishService';
import EnglishWord from '../../models/EnglishWord';

describe('Testing English Service', () => {
  const coll: any = {
    insertOne: jest.fn(async (data: object) => ({
      insertedId: new ObjectId(),
    })),
    updateOne: jest.fn(
      async (
        _filter: Filter<Document>,
        _update: Partial<Document> | UpdateFilter<Document>
      ) => ({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null,
      })
    ),
    findOne: null,
    aggregate: jest.fn(() => ({ toArray: async () => [] })),
  };

  afterEach(() => {
    const keys = Object.keys(coll);

    for (const key of keys) {
      coll[key].mockClear();
    }
  });

  const englishService = new EnglishService(coll);

  describe('Testing addWord method', () => {
    it("Should call findOne to validate that word isn't already registered on database, and if it is, should return null", async () => {
      coll.findOne = jest.fn(async (data: object) => ({
        insertedId: new ObjectId(),
      }));

      const enWord = new EnglishWord('foot', []);

      const data = await englishService.addWord(enWord);

      expect(coll.findOne).toBeCalledTimes(1);
      expect(data).toBe(null);
    });

    it("Should call findOne to register word on db if it isn't already and return the registered data.", async () => {
      coll.findOne = jest.fn(async (data: object) => null);

      const enWord = new EnglishWord('foot', []);

      const data = await englishService.addWord(enWord);

      expect(coll.findOne).toBeCalledTimes(1);
      expect(coll.insertOne).toBeCalledTimes(1);
      expect(['_id', ...Object.keys(enWord)]).toStrictEqual(Object.keys(data!));
    });
  });

  describe('Testing getWordId method', () => {
    it('Should call findOne to get the document and transform the word to lower case before searching.', async () => {
      coll.findOne = jest.fn(async (data: object) => null);

      await englishService.getWordId('FOOT');

      expect(coll.findOne).toBeCalledTimes(1);
      expect(coll.findOne).toBeCalledWith({ word: 'foot' });
    });
  });

  describe('Testing updateWord method', () => {
    it('Should call updateOne method', async () => {
      await englishService.updateWord('foot', 'FEET');

      expect(coll.updateOne).toBeCalledTimes(1);
    });

    it('Should crerate the propper regex and transform received word to lower case before updating the resgistry', async () => {
      await englishService.updateWord('foot', 'FEET');

      expect(coll.updateOne).toBeCalledWith(
        {
          word: {
            $regex: 'foot',
            $options: 'i',
          },
        },
        {
          $set: {
            word: 'feet',
          },
        }
      );
    });
  });

  describe('Testing appendTranslation method', () => {
    it('Should call the updateOne method', async () => {
      await englishService.appendTranslation(new ObjectId(), new ObjectId());

      expect(coll.updateOne).toBeCalledTimes(1);
    });

    it('Should search englishWord by ID and call the $addToSet query operator', async () => {
      const englishWordID = new ObjectId();
      const portugueseWordID = new ObjectId();

      await englishService.appendTranslation(englishWordID, portugueseWordID);

      expect(coll.updateOne).toBeCalledWith(
        {
          _id: englishWordID,
        },
        {
          $addToSet: {
            ptWords: portugueseWordID,
          },
        }
      );
    });
  });

  describe('Testing queryWord method', () => {
    it('Should call the aggregate method', async () => {
      await englishService.queryWord('GROUND');

      expect(coll.aggregate).toBeCalledTimes(1);
      expect(coll.aggregate).toBeCalledWith([
        {
          $match: {
            word: 'ground',
          },
        },
        {
          $lookup: {
            from: 'ptWords',
            localField: 'ptWords',
            foreignField: '_id',
            as: 'ptWords',
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
      ]);
    });
  });
});
