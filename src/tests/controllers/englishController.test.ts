import { describe, it, expect, jest, afterEach } from '@jest/globals';
import EnglishController from '../../controllers/englishController';
import { ObjectId, UpdateFilter, Document, Filter } from 'mongodb';

describe('Testing English Controller', () => {
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
    findOne: jest.fn(),
  };

  const enInjector: any = {
    makeWord: jest.fn((word: string, ptWords: ObjectId[]) => ({
      word,
      ptWords,
    })),
    addWord: jest.fn(async (data: object) => null),
    getWordId: jest.fn(async (word: string) => ({
      _id: new ObjectId('6373f2215d8b936b5cd29661'),
      word,
      ptWords: [],
    })),
    updateWord: jest.fn(async (enWordSearch: string, enWord: string) => ({
      acknowledged: true,
      matchedCount: 0,
      modifiedCount: 0,
      upsertedCount: 0,
      upsertedId: null,
    })),
    appendTranslation: jest.fn(
      async (enWordId: ObjectId, ptWordId: ObjectId) => ({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null,
      })
    ),
  };

  const englishController = new EnglishController(coll, enInjector);

  afterEach(() => {
    const keys = Object.keys(coll);

    for (const key of keys) {
      coll[key].mockClear();
    }
  });

  describe('Testing addWord method', () => {
    it('Should call injector makeWord and addWord method', async () => {
      await englishController.addWord('feet', []);

      expect(enInjector.makeWord).toBeCalledTimes(1);
      expect(enInjector.makeWord).toBeCalledWith('feet', []);
      expect(enInjector.addWord).toBeCalledTimes(1);
      expect(enInjector.addWord).toBeCalledWith({
        word: 'feet',
        ptWords: [],
      });
    });

    it('Should return the response from the service', async () => {
      const data = await englishController.addWord('feet', []);

      expect(data).toBe(null);
    });
  });

  describe('Testing getWordId method', () => {
    it('Shoud call the inject getWordId method', async () => {
      await englishController.getWordId('HAND');

      expect(enInjector.getWordId).toBeCalledTimes(1);
      expect(enInjector.getWordId).toBeCalledWith('HAND');
    });

    it('Should return the service data', async () => {
      const data = await englishController.getWordId('hand');

      expect(data).toStrictEqual({
        _id: new ObjectId('6373f2215d8b936b5cd29661'),
        word: 'hand',
        ptWords: [],
      });
    });
  });

  describe('Testing updateWord method', () => {
    it('Should call the injector updateWord method', async () => {
      await englishController.updateWord('hand', { update: 'handy' });

      expect(enInjector.updateWord).toBeCalledTimes(1);
      expect(enInjector.updateWord).toBeCalledWith('hand', 'handy');
    });

    it('Should return a string telling if item was not updated', async () => {
      const data = await englishController.updateWord('hand', {
        update: 'handy',
      });

      expect(data).toStrictEqual(`hand is not registered.`);
    });

    it('Should return a string telling if item was updated', async () => {
      enInjector.updateWord = jest.fn(
        async (enWordSearch: string, enWord: string) => ({
          acknowledged: true,
          matchedCount: 0,
          modifiedCount: 1,
          upsertedCount: 0,
          upsertedId: null,
        })
      );

      const data = await englishController.updateWord('hand', {
        update: 'handy',
      });

      expect(data).toStrictEqual(`hand updated.`);
    });
  });

  describe('Testing appendTranslation method', () => {
    it('Should call the injector appendTranslation method', async () => {
      const enObjId = new ObjectId();
      const ptObjId = new ObjectId();

      await englishController.appendTranslation(enObjId, ptObjId);

      expect(enInjector.appendTranslation).toBeCalledTimes(1);
      expect(enInjector.appendTranslation).toBeCalledWith(enObjId, ptObjId);
    });

    it('Should return a string telling that the translation is already registered', async () => {
      const data = await englishController.appendTranslation(
        new ObjectId(),
        new ObjectId()
      );

      expect(data).toBe('Translation already registered.');
    });

    it('Should return a string telling if the translation was appended', async () => {
      enInjector.appendTranslation = jest.fn(
        async (enWordId: string, ptWordId: string) => ({
          acknowledged: true,
          matchedCount: 0,
          modifiedCount: 1,
          upsertedCount: 0,
          upsertedId: null,
        })
      );

      const data = await englishController.appendTranslation(
        new ObjectId(),
        new ObjectId()
      );

      expect(data).toBe('Translation registered.');
    });
  });
});
