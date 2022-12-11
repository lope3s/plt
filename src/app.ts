import { config } from 'dotenv';

config();

import db from './config/db';
import { Command } from 'commander';
import PortugueseController from './controllers/portugueseController';
import PortugueseInjector from './injectors/portugueseInjector';
import EnglishController from './controllers/englishController';
import EnglishInjector from './injectors/englishInjector';

const app = new Command();
const portugueseController = new PortugueseController(
  db.collection('ptWords'),
  PortugueseInjector
);
const englishController = new EnglishController(
  db.collection('enWords'),
  EnglishInjector
);

app
  .name('Personal Language Trainer - PLT\n')
  .description('CLI to help expand english vocabulary');

app
  .command('addPt')
  .description('Add a Portuguese word')
  .argument('<ptWords...>')
  .action(async (ptWords) => {
    const alreadyRegisteredWords: string[] = [];

    for (const ptWord of ptWords) {
      const wordResgistered = await portugueseController.addWord(ptWord);

      if (!wordResgistered) alreadyRegisteredWords.push(ptWord.toLowerCase());
    }

    if (alreadyRegisteredWords.length)
      console.log(
        'The following words have already been registered: ',
        alreadyRegisteredWords
      );

    console.log(
      `Registered count: ${ptWords.length - alreadyRegisteredWords.length}`
    );
    return;
  });

app
  .command('addEn')
  .description('Add a English word')
  .argument('<ptWord>')
  .argument('<enWords...>')
  .action(async (ptWord, enWords) => {
    const ptWordRegistered = await portugueseController.getWordId(ptWord);

    if (!ptWordRegistered) return console.log(`${ptWord} is not registered.`);

    const alreadyRegisteredWords: string[] = [];

    for (const enWord of enWords) {
      const wordRegistered = await englishController.addWord(enWord, [
        ptWordRegistered._id,
      ]);

      if (!wordRegistered) alreadyRegisteredWords.push(enWord.toLowerCase());
    }

    if (alreadyRegisteredWords.length)
      return console.log(
        'The following words are already registered: ',
        alreadyRegisteredWords
      );

    return console.log(
      `Registered count: ${enWords.length - alreadyRegisteredWords.length}`
    );
  });

app
  .command('updatePt')
  .description('Update a Portuguese word')
  .argument('<ptWordSearch>')
  .option('-nv, --new-value <value>', 'Update the word with the provided value')
  .action(async (ptWordSearch, opt) => {
    const wordRegistered = await portugueseController.updateWord(
      ptWordSearch,
      opt
    );

    return console.log(wordRegistered);
  });

app
  .command('updateEn')
  .description('Update a English word')
  .argument('<enWordSearch>')
  .option('-u, --update <value>', 'Update registered word')
  .option(
    '-a, --append <ptWords...>',
    'Append Portuguese words to possible translations of the word.'
  )
  .action(async (enWordSearch, opt) => {
    if (opt.append) {
      const enWordId = await englishController.getWordId(enWordSearch);

      if (!enWordId) return console.log(`${enWordSearch} is not registered.`);

      const notRegisteredPtWords: string[] = [];

      for (const ptWord of opt.append) {
        const ptWordId = await portugueseController.getWordId(ptWord);

        if (!ptWordId) {
          notRegisteredPtWords.push(ptWord);
          continue;
        }

        await englishController.appendTranslation(enWordId._id, ptWordId._id);
      }

      if (notRegisteredPtWords.length)
        return console.log(
          `The following words are not registered: `,
          notRegisteredPtWords
        );

      return console.log('Translations added');
    }

    if (opt.update) {
      const wordRegistered = await englishController.updateWord(
        enWordSearch,
        opt
      );

      return console.log(wordRegistered);
    }
  });

app.parse();
