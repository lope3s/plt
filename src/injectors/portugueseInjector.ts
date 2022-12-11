import db from '../config/db';
import PortugueseWord from '../models/PortugueseWord';
import PortugueseService from '../services/portugueseService';

class PortugueseInjector {
  static makeWord(ptWord: string) {
    return new PortugueseWord(ptWord);
  }

  static async addWord(ptWord: PortugueseWord) {
    const ptService = new PortugueseService(db.collection('ptWords'));
    return await ptService.addWord(ptWord);
  }

  static async getWordId(ptWord: string) {
    const ptService = new PortugueseService(db.collection('ptWords'));
    return await ptService.getWordId(ptWord);
  }

  static async updateWord(ptWordSearch: string, ptWordUpdate: string) {
    const ptService = new PortugueseService(db.collection('ptWords'));
    return await ptService.updateWord(ptWordSearch, ptWordUpdate);
  }
}

export default PortugueseInjector;
