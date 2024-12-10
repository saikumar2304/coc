import { EmbedBuilder } from "discord.js";
import { GameManager } from "../managers/GameManager.js";
import { CONFIG } from "../../../utils/config.js";
import { cards } from "../data/cards.js";
import { logger } from "../../../utils/logger.js";

export const give = {
  name: "give",
  description: "Give Player any card [ bot devs! ]",
  execute: async (message) => {
    if (
      message.author.id !== "1114977629255250031" && // womp womp
      message.author.id !== "398285502341578775" // purple memer
    )
      return;

    const game = GameManager.getGame(message.channelId);

    if (!game || !game.isStarted) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle("❌ Error")
        .setDescription("No active game in this channel!");

      return await message.reply({ embeds: [errorEmbed] });
    }

    const player = game.players.get(message.author.id);

    if (!player) {
      logger.error("Player not in game", { userId: message.author.id });
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle("❌ Error")
        .setDescription("You are not in this game!");

      return await message.reply({ embeds: [errorEmbed] });
    }

    const cardName = message?.content
      .slice(message?.content.split(" ")[0].length)
      .trim();

    if (!cardName) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle("❌ Error")
        .setDescription(`Enter Card Name!`);

      return await message.reply({ embeds: [errorEmbed] });
    }
    const cardIndex = cards.findIndex((card) => card.name === cardName);

    if (cardIndex === -1) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle("❌ Error")
        .setDescription(`The card "${cardName}" does not exist!`);

      return await message.reply({ embeds: [errorEmbed] });
    }

    if (player.hand.length === 0) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle("❌ Error")
        .setDescription("You don't have any cards in your hand to remove!");

      return await message.reply({ embeds: [errorEmbed] });
    }

    const randomCardIndex = Math.floor(Math.random() * player.hand.length);
    const randomCard = player.removeCard(randomCardIndex);

    logger.debug("Random card removed", {
      playerId: player.user.id,
      cardName: randomCard.name,
      remainingHandSize: player.hand.length,
    });

    const newCard = cards[cardIndex];
    player.drawCard(newCard);

    logger.debug("Card added", {
      playerId: player.user.id,
      cardName: newCard.name,
      newHandSize: player.hand.length,
    });

    const successEmbed = new EmbedBuilder()
      .setColor(CONFIG.colors.success)
      .setTitle("✅ Success")
      .setDescription(
        `You removed a random card "${randomCard.name}" and added "${newCard.name}" to your hand.`
      );

    return await message.reply({ embeds: [successEmbed] });
  },
};
