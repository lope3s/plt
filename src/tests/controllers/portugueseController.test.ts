import { describe, it, afterEach, expect, jest } from '@jest/globals';
import PortugueseController from '../../controllers/portugueseController';

describe('Testing portugueseController', () => {
  const ptInjector: any = {
    makeWord: jest.fn((ptWord: string) => ({ ptWord })),
    addWord: jest.fn(),
    getWordId: jest.fn((ptWord: string) => ({
      ptWord,
    })),
    updateWord: jest.fn(async (enWordSearch: string, enWord: string) => ({
      acknowledged: true,
      matchedCount: 0,
      modifiedCount: 0,
      upsertedCount: 0,
      upsertedId: null,
    })),
  };

  const coll: any = {
    findOne: jest.fn(),
    insertOne: jest.fn(),
  };

  const portugueseController = new PortugueseController(coll, ptInjector);

  afterEach(() => {
    const keys = Object.keys(ptInjector);

    for (const key of keys) {
      ptInjector[key].mockClear();
    }
  });

  describe('Testing addWord method', () => {
    it('Should call ptInjector makeWord method', async () => {
      await portugueseController.addWord('teste');

      expect(ptInjector.makeWord).toBeCalledTimes(1);
      expect(ptInjector.makeWord).toBeCalledWith('teste');
    });

    it('Should call ptInjector addWord method', async () => {
      await portugueseController.addWord('teste');

      expect(ptInjector.addWord).toBeCalledTimes(1);
      expect(ptInjector.addWord).toBeCalledWith({ ptWord: 'teste' });
    });

    it('Should return the same value as ptInjector addWord method', async () => {
      ptInjector.addWord = jest.fn((queryObj: object) => null);

      const data = await portugueseController.addWord('teste');

      expect(data).toBe(null);
    });
  });

  describe('Testing getWordId method', () => {
    it('Should call ptInjector getWordId method', async () => {
      await portugueseController.getWordId('teste');

      expect(ptInjector.getWordId).toBeCalledTimes(1);
      expect(ptInjector.getWordId).toBeCalledWith('teste');
    });

    it('Should return the same result as the ptInjector getWordId method', async () => {
      const data = await portugueseController.getWordId('teste');

      expect(data).toStrictEqual({ ptWord: 'teste' });
    });
  });

  describe('Testing updateWord method', () => {
    it('Should call the ptInjector updateWord method', async () => {
      await portugueseController.updateWord('teste', { newValue: 'testes' });

      expect(ptInjector.updateWord).toBeCalledTimes(1);
      expect(ptInjector.updateWord).toBeCalledWith('teste', 'testes');
    });

    it('Should return string telling that word is not registered', async () => {
      const data = await portugueseController.updateWord('teste', {
        newValue: 'testes',
      });

      expect(data).toBe('teste is not registered.');
    });

    it('Should return string telling that word was updated', async () => {
      ptInjector.updateWord = jest.fn(
        async (enWordSearch: string, enWord: string) => ({
          acknowledged: true,
          matchedCount: 0,
          modifiedCount: 1,
          upsertedCount: 0,
          upsertedId: null,
        })
      );

      const data = await portugueseController.updateWord('teste', {
        newValue: 'testes',
      });

      expect(data).toBe('teste updated.');
    });
  });
});