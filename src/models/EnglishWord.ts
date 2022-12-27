import { ObjectId } from 'mongodb';

class EnglishWord {
  word;
  ptWords;
  categories;

  constructor(word: string, ptWords: ObjectId[], categories: ObjectId[]) {
    this.word = word.toLowerCase();
    this.ptWords = ptWords;
    this.categories = categories;
  }
}

export default EnglishWord;
