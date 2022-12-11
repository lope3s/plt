import { ObjectId } from 'mongodb';

class EnglishWord {
  word;
  ptWords;

  constructor(word: string, ptWords: ObjectId[]) {
    this.word = word.toLowerCase();
    this.ptWords = ptWords;
  }
}

export default EnglishWord;
