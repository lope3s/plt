import { describe, it, jest, expect } from '@jest/globals';
import WordCategoryController from '../../controllers/wordCategoryController';

describe('Testing word category controller', () => {
  const wrdCtgryInjector: any = {
    makeCategory: jest.fn((category: string) => ({
      category: category.toLowerCase(),
    })),
    addCategory: jest.fn((category: object) => null),
    queryCategories: jest.fn(() => []),
    updateCategory: jest.fn(
      (searchValue: string, newValue: string) => `${searchValue} not found.`
    ),
    deleteCategory: jest.fn((category: string) => `${category} deleted.`),
  };

  const wordCategoryController = new WordCategoryController(wrdCtgryInjector);

  describe('Testing add category method', () => {
    it('Should call make category method and add word method', async () => {
      await wordCategoryController.addCategory('TEST');

      expect(wrdCtgryInjector.makeCategory).toBeCalledTimes(1);
      expect(wrdCtgryInjector.makeCategory).toBeCalledWith('TEST');
      expect(wrdCtgryInjector.addCategory).toBeCalledTimes(1);
      expect(wrdCtgryInjector.addCategory).toBeCalledWith({
        category: 'test',
      });
    });

    it('Should return the same value as the injector', async () => {
      const registeredCategory = await wordCategoryController.addCategory(
        'TESTE'
      );

      expect(registeredCategory).toBe(null);
    });
  });

  describe('Testing query category method', () => {
    it('Should call the quer categories injector method', async () => {
      await wordCategoryController.queryCategories();

      expect(wrdCtgryInjector.queryCategories).toBeCalledTimes(1);
    });

    it('Should call the injector with right params if category is provided', async () => {
      await wordCategoryController.queryCategories('test');

      expect(wrdCtgryInjector.queryCategories).toBeCalledWith('test');
    });

    it('Should return the same value as the injector', async () => {
      const queryResult = await wordCategoryController.queryCategories();

      expect(queryResult).toStrictEqual([]);
    });
  });

  describe('Testing update category method', () => {
    it('Should call the update category injector method', async () => {
      await wordCategoryController.updateCategory('test', 'test2');

      expect(wrdCtgryInjector.updateCategory).toBeCalledTimes(1);
      expect(wrdCtgryInjector.updateCategory).toBeCalledWith('test', 'test2');
    });

    it('Should return the same data as the injector', async () => {
      const updatedCategory = await wordCategoryController.updateCategory(
        'test',
        'test2'
      );

      expect(updatedCategory).toBe(`test not found.`);
    });
  });

  describe('Testing delete category method', () => {
    it('Should call the delete category injector method', async () => {
      await wordCategoryController.deleteCategory('test');

      expect(wrdCtgryInjector.deleteCategory).toBeCalledTimes(1);
      expect(wrdCtgryInjector.deleteCategory).toBeCalledWith('test');
    });

    it('Should return the same data as the injector', async () => {
      const updatedCategory = await wordCategoryController.deleteCategory(
        'test'
      );

      expect(updatedCategory).toBe(`test deleted.`);
    });
  });
});
