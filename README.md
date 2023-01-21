# Personal Language Trainer - PLT

#### Video Demo: <https://youtu.be/rvYgHQ3f2Jc>

#### Description:

## Project idea:

In this project i aimed to create a simple tool that would help programmers, specialy portuguese and english speakers, to expand its own vocabulary and practice how to say the words correctly.<br>
With this project you'll be able to add new words and their translations to portuguese or english and search for them in order to practice and improve your skills in the language you want to learn.<br>
This project is a command-line program built to be easy to use and fast, so you don't need to expend too much time adding words and compromise your daily performance.

## Techinical information:

This is a CLI using Node.js, Typescript, Commander, Jest and MongoDB as database. <br>
Commander is a solution for Node.js command-line interfaces. <br>
It was used to speed the process of creating a CLI for having a strong set of built-in functions for defining options, descriptions and help text for each command.<br>
The tests were writen with the combination between Jest and ts-jest to run tests without having to compile the code every time. In these tests i wanted to practice unit testing and some patterns to create more familiarity with test writing so in this project i've implemented the IoC (Inversion of Controll) and DI (Dependecy Injection) to create loosely coupled components and asure that i would be able to unit test my code properly. <br>
At last but not least i've choosed to use MongoDB in this project because of the loosely structure of the data and the sometimes not so clear relation to some translations and so because i could use the 500mb of free cloud storage that Mongo Atlas offers you and with that, guarantee that information can be shared across devices.

## Next steps:

The original idea of this project was to create a one-person game, where the player would be able to register words and after play a "guess the translation" game to practice the new words, because only through repetition and practice we can really incorporate new words to our vocabulary.
and how it is a game, it would have some metrics to help the player track its progress and to stablish new goals as it keeps evolving.
During the project development though, another idea rise up, the possibility to practive not only the reading and writing but also speaking with a voice recorder and a match with the correct pronuntiation of the spelled word.
So the next steps of this project are going to be those ideias and te possibility to install it locally.

## How to isntall:

-   After making the clone, open the install.sh and add your MONGO_URL, after that just run:

```bash
. install.sh
```

### Commands

## Add portuguese word

With this command you can provide many portuguese words to your dataset, after that you'll be able to reference those words as a translation of other english words with the `addEn` command.

```bash
npm start -- addPt <ptWords...>
```

## Add english word

With this command you can add new English words, and link them to some Portuguese words that you already added.

```bash
npm start -- addEn <ptWord> <enWords...>
```

## Update portuguese word

Update a Portuguese word to a new value, this command receive a word to search for and has an option `-nv` to receive the new word.

```bash
npm start -- updatePt -nv <newValue> <ptWordSearch>
```

## Update english word

Update a English word to a new value, this command receive a word to search for and has an option `-u` to only update the English word, and an option `-a` to append new translations to its translation set.

```bash
npm start -- updateEn -u <value> -a <ptWords...> <enWordSearch>
```

## Search for words

Search for a portuguese or english word and it's translations, default search for english words.

```bash
npm start -- searchWord -l <pt | en> <word>
```
