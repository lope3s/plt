import { ObjectId } from 'mongodb';
import db from '../config/db';
import EnglishWord from '../models/EnglishWord';
import EnglishService from '../services/englishService';

class EnglishInjector {
  static makeWord(word: string, ptWords: ObjectId[]) {
    return new EnglishWord(word, ptWords);
  }

  static async addWord(enWord: EnglishWord) {
    const enService = new EnglishService(db.collection('enWords'));

    return await enService.addWord(enWord);
  }

  static async getWordId(enWord: string) {
    const enService = new EnglishService(db.collection('enWords'));

    return await enService.getWordId(enWord);
  }

  static async updateWord(enWordSearch: string, enWord: string) {
    const enService = new EnglishService(db.collection('enWords'));
    return await enService.updateWord(enWordSearch, enWord);
  }

  static async appendTranslation(enWordId: ObjectId, ptWordId: ObjectId) {
    const enService = new EnglishService(db.collection('enWords'));
    return await enService.appendTranslation(enWordId, ptWordId);
  }
}

export default EnglishInjector;
