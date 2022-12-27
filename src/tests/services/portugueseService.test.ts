import { describe, it, jest, expect, afterEach } from '@jest/globals';
import { ObjectId, Document, Filter, UpdateFilter } from 'mongodb';
import PortugueseService from '../../services/portugueseService';
import PortugueseWord from '../../models/PortugueseWord';

describe('Testing Portuguese Service', () => {
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

  const portugueseService = new PortugueseService(coll);

  describe('Testing addWord method', () => {
    it("Should call findOne to validate that word isn't already registered on database, and if it is, should return null", async () => {
      coll.findOne = jest.fn(async (data: object) => ({
        insertedId: new ObjectId(),
      }));

      const ptWord = new PortugueseWord('pé', []);

      const data = await portugueseService.addWord(ptWord);

      expect(coll.findOne).toBeCalledTimes(1);
      expect(data).toBe(null);
    });

    it("Should call findOne to register word on db if it isn't already and return the registered data.", async () => {
      coll.findOne = jest.fn(async (data: object) => null);

      const ptWord = new PortugueseWord('pé', []);

      const data = await portugueseService.addWord(ptWord);

      expect(coll.findOne).toBeCalledTimes(1);
      expect(coll.insertOne).toBeCalledTimes(1);
      expect(['_id', ...Object.keys(ptWord)]).toStrictEqual(Object.keys(data!));
    });
  });

  describe('Testing getWordId method', () => {
    it('Should call findOne to get the document and transform the word to lower case before searching.', async () => {
      coll.findOne = jest.fn(async (data: object) => null);

      await portugueseService.getWordId('PÉ');

      expect(coll.findOne).toBeCalledTimes(1);
      expect(coll.findOne).toBeCalledWith({ ptWord: 'pé' });
    });
  });

  describe('Testing updateWord method', () => {
    it('Should call updateOne method', async () => {
      await portugueseService.updateWord('pé', 'PÉS', []);

      expect(coll.updateOne).toBeCalledTimes(1);
    });

    it('Should crerate the propper regex and transform received word to lower case before updating the resgistry', async () => {
      await portugueseService.updateWord('pé', 'PÉS', []);

      expect(coll.updateOne).toBeCalledWith(
        {
          ptWord: {
            $regex: 'pé',
            $options: 'i',
          },
        },
        {
          $set: {
            ptWord: 'pés',
          },
          $addToSet: {
            categories: { $each: [] },
          },
        }
      );
    });
  });

  describe('Testing queryWord method', () => {
    it('Should call aggregate method', async () => {
      await portugueseService.queryWord('CHÃO');

      expect(coll.aggregate).toBeCalledTimes(1);
      expect(coll.aggregate).toBeCalledWith([
        {
          $match: {
            ptWord: 'chão',
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
      ]);
    });
  });
});
