import PortugueseInjector from '../injectors/portugueseInjector';
import { ObjectId } from 'mongodb';

class PortugueseController {
  ptInjector;

  constructor(portugueseInjector: typeof PortugueseInjector) {
    this.ptInjector = portugueseInjector;
  }

  async addWord(ptWord: string, categories: ObjectId[] = []) {
    const portugueseWord = this.ptInjector.makeWord(ptWord, categories);

    return await this.ptInjector.addWord(portugueseWord);
  }

  async getWordId(ptWord: string) {
    return await this.ptInjector.getWordId(ptWord);
  }

  async updateWord(
    ptWordSearch: string,
    { newValue }: { newValue: string },
    categoriesToAdd: ObjectId[]
  ) {
    const updatedTranslation = await this.ptInjector.updateWord(
      ptWordSearch,
      newValue,
      categoriesToAdd
    );

    if (updatedTranslation.modifiedCount === 0)
      return `${ptWordSearch} is not registered.`;

    return `${ptWordSearch} updated.`;
  }

  async queryWord(word: string) {
    const searchedWord = await this.ptInjector.queryWord(word);

    if (!searchedWord.length) return `${word} not found.`;

    return searchedWord[0];
  }
}

export default PortugueseController;
