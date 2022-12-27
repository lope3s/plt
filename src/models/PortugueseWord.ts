import { ObjectId } from 'mongodb';

class PortugueseWord {
  ptWord;
  categories;

  constructor(ptWord: string, categories: ObjectId[]) {
    this.ptWord = ptWord.toLowerCase();
    this.categories = categories;
  }
}

export default PortugueseWord;
