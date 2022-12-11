import { Collection, Document, ObjectId } from 'mongodb';
import EnglishInjector from '../injectors/englishInjector';

class EnglishController {
  coll;
  enInjector;

  constructor(coll: Collection<Document>, enInjector: typeof EnglishInjector) {
    this.coll = coll;
    this.enInjector = enInjector;
  }

  async addWord(word: string, ptWords: ObjectId[]) {
    const englishWord = this.enInjector.makeWord(word, ptWords);

    return await this.enInjector.addWord(englishWord);
  }

  async getWordId(word: string) {
    return await this.enInjector.getWordId(word);
  }

  async updateWord(enWordSearch: string, { update }: { update: string }) {
    const updatedTranslation = await this.enInjector.updateWord(
      enWordSearch,
      update
    );

    if (updatedTranslation.modifiedCount === 0)
      return `${enWordSearch} is not registered.`;

    return `${enWordSearch} updated.`;
  }

  async appendTranslation(enWordId: ObjectId, ptWordId: ObjectId) {
    const updatedTranslation = await this.enInjector.appendTranslation(
      enWordId,
      ptWordId
    );

    if (updatedTranslation.modifiedCount === 0)
      return `Translation already registered.`;

    return `Translation registered.`;
  }
}

export default EnglishController;
