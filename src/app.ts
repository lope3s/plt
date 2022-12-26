import { config } from "dotenv";

config();

import { Command } from "commander";
import PortugueseController from "./controllers/portugueseController";
import PortugueseInjector from "./injectors/portugueseInjector";
import EnglishController from "./controllers/englishController";
import EnglishInjector from "./injectors/englishInjector";
import WordCategoryController from "./controllers/wordCategoryController";
import WordCategoryInjector from "./injectors/wordCategoryInjector";
import { Document } from "mongodb";

const app = new Command();

const portugueseController = new PortugueseController(PortugueseInjector);
const englishController = new EnglishController(EnglishInjector);

const wordCategoryController = new WordCategoryController(WordCategoryInjector);

app.name("Personal Language Trainer - PLT\n").description(
    "CLI to help expand english vocabulary"
);

app.command("addPt")
    .description("Add a Portuguese word.")
    .argument("<ptWords...>")
    .action(async (ptWords) => {
        const alreadyRegisteredWords: string[] = [];

        for (const ptWord of ptWords) {
            const wordResgistered = await portugueseController.addWord(ptWord);

            if (!wordResgistered)
                alreadyRegisteredWords.push(ptWord.toLowerCase());
        }

        if (alreadyRegisteredWords.length)
            console.log(
                "The following words have already been registered: ",
                alreadyRegisteredWords
            );

        console.log(
            `Registered count: ${
                ptWords.length - alreadyRegisteredWords.length
            }`
        );
        return;
    });

app.command("addEn")
    .description("Add a English word.")
    .argument("<ptWord>")
    .argument("<enWords...>")
    .action(async (ptWord, enWords) => {
        const ptWordRegistered = await portugueseController.getWordId(ptWord);

        if (!ptWordRegistered)
            return console.log(`${ptWord} is not registered.`);

        const alreadyRegisteredWords: string[] = [];

        for (const enWord of enWords) {
            const wordRegistered = await englishController.addWord(enWord, [
                ptWordRegistered._id,
            ]);

            if (!wordRegistered)
                alreadyRegisteredWords.push(enWord.toLowerCase());
        }

        if (alreadyRegisteredWords.length)
            return console.log(
                "The following words are already registered: ",
                alreadyRegisteredWords
            );

        return console.log(
            `Registered count: ${
                enWords.length - alreadyRegisteredWords.length
            }`
        );
    });

app.command("updatePt")
    .description("Update a Portuguese word.")
    .argument("<ptWordSearch>")
    .option(
        "-nv, --new-value <value>",
        "Update the word with the provided value."
    )
    .action(async (ptWordSearch, opt) => {
        const wordRegistered = await portugueseController.updateWord(
            ptWordSearch,
            opt
        );

        return console.log(wordRegistered);
    });

app.command("updateEn")
    .description("Update a English word.")
    .argument("<enWordSearch>")
    .option("-u, --update <value>", "Update registered word.")
    .option(
        "-a, --append <ptWords...>",
        "Append Portuguese words to possible translations of the word."
    )
    .action(async (enWordSearch, opt) => {
        if (opt.append) {
            const enWordId = await englishController.getWordId(enWordSearch);

            if (!enWordId)
                return console.log(`${enWordSearch} is not registered.`);

            const notRegisteredPtWords: string[] = [];

            for (const ptWord of opt.append) {
                const ptWordId = await portugueseController.getWordId(ptWord);

                if (!ptWordId) {
                    notRegisteredPtWords.push(ptWord);
                    continue;
                }

                await englishController.appendTranslation(
                    enWordId._id,
                    ptWordId._id
                );
            }

            if (notRegisteredPtWords.length)
                return console.log(
                    `The following words are not registered: `,
                    notRegisteredPtWords
                );

            return console.log("Translations added");
        }

        if (opt.update) {
            const wordRegistered = await englishController.updateWord(
                enWordSearch,
                opt
            );

            return console.log(wordRegistered);
        }
    });

app.command("searchWord")
    .description(
        "Search for a portuguese or english word and it's translations, default search for english words."
    )
    .argument("<word>")
    .requiredOption(
        "-l, --language <pt | en>",
        "Select between pt or en to search for translations.",
        "en"
    )
    .action(async (word, opt, a) => {
        if (opt.language === "en") {
            const enWord: Document | string = await englishController.queryWord(
                word
            );

            if (typeof enWord === "string") return console.log(enWord);

            console.log(`Possible translations for ${word}:`);

            for (const ptWord of enWord.ptWords) {
                console.log(`\n${ptWord.ptWord}`);
            }
        }

        if (opt.language === "pt") {
            const ptWord = await portugueseController.queryWord(word);

            if (typeof ptWord === "string") return console.log(ptWord);

            console.log(`Possible translations for ${word}:`);

            for (const enWord of ptWord.enWords) {
                console.log(`\n${enWord.word}`);
            }
        }

        return;
    });

app.command("addCategory")
    .description(
        "Add new word categories that you can search for to train specific subjects of your vocabular."
    )
    .argument("<category>")
    .action(async (category) => {
        const addedCategory = await wordCategoryController.addCategory(
            category
        );

        if (!addedCategory) return console.log("Category already registered.");

        return console.log(addedCategory);
    });

app.command("queryCategories")
    .description("Return a list of all registered categories.")
    .action(async () => {
        const categories = await wordCategoryController.queryCategories();

        if (!categories.length) return console.log('No categories registered.')

        console.log("Registered categories:\n");

        for (const category of categories) {
            console.log(category.category);
        }
    });

app.command("updateCategory")
    .description("Update a provided category to a new value.")
    .argument("<searchValue>")
    .argument("<newValue>")
    .action(async (searchValue, newValue) => {
        const updatedCategory: string =
            await wordCategoryController.updateCategory(searchValue, newValue);

        return console.log(updatedCategory);
    });

app.command("deleteCategory")
    .description("Deletes a provided category if it's already registered")
    .argument("<category>")
    .action(async (category) => {
        const deletedCategory = await wordCategoryController.deleteCategory(
            category
        );

        return console.log(deletedCategory);
    });

app.parse();
