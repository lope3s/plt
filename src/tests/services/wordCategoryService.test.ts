import { describe, it, jest, afterEach, expect } from '@jest/globals';
import WordCategoryService from '../../services/wordCategoryService';
import WordCategory from '../../models/WordsCategory';
import { ObjectId } from 'mongodb';

describe('Testing word category service', () => {
  const coll: any = {
    findOne: undefined,
    insertOne: jest.fn(async () => ({
      insertedId: new ObjectId(),
    })),
    updateOne: undefined,
    deleteOne: undefined,
    find: jest.fn(() => ({ toArray: async () => [] })),
  };

  afterEach(() => {
    const keys = Object.keys(coll);

    for (const key of keys) {
      coll[key]?.mockClear();
    }
  });

  const wordCategoryService = new WordCategoryService(coll);

  describe('Testing add category method', () => {
    it('Should call findOne and insertOne method', async () => {
      coll.findOne = jest.fn(async () => null);

      const wordCategory = new WordCategory('TEST');

      await wordCategoryService.addCategory(wordCategory);

      expect(coll.findOne).toBeCalledTimes(1);
      expect(coll.insertOne).toBeCalledTimes(1);
      expect(coll.findOne).toBeCalledWith({
        category: 'test',
      });
      expect(coll.insertOne).toBeCalledWith(wordCategory);
    });

    it('Should return null if category is already registered', async () => {
      coll.findOne = jest.fn(async () => ({}));

      const wordCategory = new WordCategory('teste');

      const registerCategory = await wordCategoryService.addCategory(
        wordCategory
      );

      expect(registerCategory).toBe(null);
    });

    it('Should return the insertedId if category is not already registered', async () => {
      coll.findOne = jest.fn(async () => null);

      const wordCategory = new WordCategory('teste');

      const registerCategory = await wordCategoryService.addCategory(
        wordCategory
      );

      expect(Object.keys(registerCategory!)).toStrictEqual(['_id', 'category']);
    });
  });

  describe('Testing update category method', () => {
    it('Should call updateOne method', async () => {
      coll.updateOne = jest.fn(async () => ({
        modifiedCount: 0,
      }));

      await wordCategoryService.updateCategory('teste', 'teste2');

      expect(coll.updateOne).toBeCalledTimes(1);
      expect(coll.updateOne).toBeCalledWith(
        {
          category: 'teste',
        },
        {
          $set: {
            category: 'teste2',
          },
        }
      );
    });

    it('Should return a string telling that category was not updated because the provided category was not found', async () => {
      coll.updateOne = jest.fn(async () => ({
        modifiedCount: 0,
      }));

      const updatedCategory = await wordCategoryService.updateCategory(
        'teste',
        'teste2'
      );

      expect(updatedCategory).toBe('teste not found.');
    });

    it('Should return a string telling that category was updated', async () => {
      coll.updateOne = jest.fn(async () => ({
        modifiedCount: 1,
      }));

      const updatedCategory = await wordCategoryService.updateCategory(
        'teste',
        'teste2'
      );

      expect(updatedCategory).toBe('teste updated to teste2.');
    });
  });

  describe('Testing delete category method', () => {
    it('Should call deleteOne method', async () => {
      coll.deleteOne = jest.fn(async () => ({
        deletedCount: 0,
      }));

      await wordCategoryService.deleteCategory('teste');

      expect(coll.deleteOne).toBeCalledTimes(1);
      expect(coll.deleteOne).toBeCalledWith({
        category: 'teste',
      });
    });

    it("Should return a string telling that the category couldn't be deleted because it wasn't found", async () => {
      coll.deleteOne = jest.fn(async () => ({
        deletedCount: 0,
      }));

      const deletedWord = await wordCategoryService.deleteCategory('teste');

      expect(deletedWord).toBe('teste not registered.');
    });

    it('Should return a string telling that the category was deleted', async () => {
      coll.deleteOne = jest.fn(async () => ({
        deletedCount: 1,
      }));

      const deletedWord = await wordCategoryService.deleteCategory('teste');

      expect(deletedWord).toBe('teste deleted.');
    });
  });

  describe('Testing query categories method', () => {
    it('Should call the find method', async () => {
      await wordCategoryService.queryCategories();

      expect(coll.find).toBeCalledTimes(1);
      expect(coll.find).toBeCalledWith({});
    });

    it('Should call the find method providing the correct params', async () => {
      await wordCategoryService.queryCategories('Test');

      expect(coll.find).toBeCalledWith({ category: 'Test' });
    });

    it('Should return an array with the query results', async () => {
      const query = await wordCategoryService.queryCategories();

      expect(query).toStrictEqual([]);
    });
  });
});
