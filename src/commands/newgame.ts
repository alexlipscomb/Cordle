import {SlashCommandBuilder} from '@discordjs/builders';
import {CommandInteraction} from 'discord.js';
import {GameCache, CordleGameState} from '../Cordle/GameCache';
import {randChoose} from '../utils';
import WordList from '../Cordle/wordlist.json';


export const data = new SlashCommandBuilder()
    .setName('newgame')
    .setDescription('Start a new game')
    .addIntegerOption((option) =>
        option
            .setName('letters')
            .setDescription('The number of letters in the word'),
    )
    .addIntegerOption((option) =>
        option
            .setName('guesses')
            .setDescription('The number of guesses available'),
    );

/**
 * The execute function for the command
 * @param {CommandInteraction} interaction
 * @return {Promise<void>}
 */
export async function execute(interaction: CommandInteraction): Promise<void> {
    const userId: string = interaction.user.id;
    let numLetters: number = 5;
    let numGuesses: number = 6;

    const numLettersOption = interaction.options.getInteger('letters');
    const numGuessesOption = interaction.options.getInteger('guesses');

    if (numLettersOption) {
        numLetters = numLettersOption;
    }

    if (numGuessesOption) {
        numGuesses = numGuessesOption;
    }

    if (numLetters < 0 || numLetters > 27) {
        await interaction.reply(
            {
                content: 'The number of letters must be between 2 and 27.',
                ephemeral: true,
            },
        );
        return;
    }

    if (numGuesses < 1 || numGuesses > 10) {
        await interaction.reply(
            {
                content: 'The number of guesses must be between 1 and 10.',
                ephemeral: true,
            },
        );
        return;
    }

    const gameState: CordleGameState = {
        answer: randChoose(
            WordList[numLetters.toString() as keyof typeof WordList],
        ),
        numLetters: numLetters,
        numGuesses: numGuesses,
        totalGuesses: 0,
        guesses: [] as string[],
        matches: [] as number[][],
    };

    GameCache.set(userId, gameState);

    await interaction.reply(
        {
            content: 'New game started!\n\n' +
            `Letters: ${numLetters}\n` +
            `Guesses: ${numGuesses}`,
            ephemeral: true,
        },
    );
}
