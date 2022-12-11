import PortugueseInjector from '../injectors/portugueseInjector';
import { Collection, Document } from 'mongodb';

class PortugueseController {
  collection;
  ptInjector;

  constructor(
    collection: Collection<Document>,
    portugueseInjector: typeof PortugueseInjector
  ) {
    this.collection = collection;
    this.ptInjector = portugueseInjector;
  }

  async addWord(ptWord: string) {
    const portugueseWord = this.ptInjector.makeWord(ptWord);

    return await this.ptInjector.addWord(portugueseWord);
  }

  async getWordId(ptWord: string) {
    return await this.ptInjector.getWordId(ptWord);
  }

  async updateWord(ptWordSearch: string, { newValue }: { newValue: string }) {
    const updatedTranslation = await this.ptInjector.updateWord(
      ptWordSearch,
      newValue
    );

    if (updatedTranslation.modifiedCount === 0)
      return `${ptWordSearch} is not registered.`;

    return `${ptWordSearch} updated.`;
  }
}

export default PortugueseController;
