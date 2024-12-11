import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} from "discord.js";
import { GameManager } from "../managers/GameManager.js";
import { CONFIG } from "../../../utils/config.js";
import { logger } from "../../../utils/logger.js";
import path from "path";
import fs from "fs";

export const play = {
  name: "play",
  description: "Play a card from your hand",
  execute: async (message, args) => {
    logger.debug("Play command received", {
      user: message.author.tag,
      args,
    });

    const game = GameManager.getGame(message.channelId);

    if (!game || !game.isStarted) {
      logger.error("No active game found", { channelId: message.channelId });
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle("❌ Error")
        .setDescription("No active game in this channel!");

      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const player = game.players.get(message.author.id);
    if (!player) {
      logger.error("Player not in game", { userId: message.author.id });
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle("❌ Error")
        .setDescription("You are not in this game!");

      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    if (game.currentTurn !== message.author.id) {
      const currentPlayer = game.players.get(game.currentTurn);
      logger.error("Not player's turn", {
        currentTurn: game.currentTurn,
        attemptingPlayer: message.author.id,
      });

      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle("❌ Error")
        .setDescription(
          `It's not your turn! Current turn: <@${currentPlayer.user.id}>`
        );

      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const cardIndex = parseInt(args[0]) - 1;
    if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= player.hand.length) {
      logger.error("Invalid card index", {
        cardIndex,
        handSize: player.hand.length,
      });
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle("❌ Error")
        .setDescription(
          "Invalid card number! Use !play <number> to play a card."
        );

      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    try {
      const card = player.hand[cardIndex];
      logger.debug("Attempting to play card", {
        cardIndex,
        card: card,
      });

      const result = game.playCard(player, cardIndex);
      logger.debug("Card played successfully", { result });

      let ImageDir = path.join(process.cwd(), "public", "images", "cards");

      let cardImagePath = path.join(ImageDir, card.type, `${card.imageUrl}`);

      if (!fs.existsSync(cardImagePath)) {
        logger.info("IMAGE NOT FOUND", {
          reason: `Image not found at ${cardImagePath}. Using default image.`,
        });
        cardImagePath = path.join(ImageDir, "HYBRID", "shadow-fang.png");
      }

      const cardImageAttachment = new AttachmentBuilder(cardImagePath);

      // Create card played embed
      const cardPlayedEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.primary)
        .setTitle(`🎴 ${card.name}`)
        .setImage("attachment://" + path.basename(cardImagePath))
        .setDescription(card.description)
        .addFields(
          { name: "👤 Player", value: player.user.username, inline: true },
          {
            name: "🎯 Target",
            value: result.nextPlayer.user.username,
            inline: true,
          },
          { name: "❤️ Player Health", value: `${player.health}`, inline: true },
          {
            name: "💔 Target Health",
            value: `${result.nextPlayer.health}`,
            inline: true,
          }
        );

      const Logs = new EmbedBuilder()
        .setColor(CONFIG.colors.primary)
        .setDescription(result.message);

      await message.channel.send({
        embeds: [cardPlayedEmbed, Logs],
        files: [cardImageAttachment],
      });

      if (result.gameOver) {
        logger.info("Game over", {
          winner: result.winner.user.username,
          finalHealth: result.winner.health,
        });

        const gameOverEmbed = new EmbedBuilder()
          .setColor(CONFIG.colors.success)
          .setTitle("👑 Game Over!")
          .setDescription(`${result.winner.user.username} wins!`)
          .addFields({
            name: "❤️ Final Health",
            value: `${result.winner.health}`,
            inline: true,
          });

        await message.channel.send({ embeds: [gameOverEmbed] });
        GameManager.endGame(message.channelId);
      } else {
        const nextTurnPlayer = game.players.get(game.currentTurn);
        logger.debug("Next turn", { player: nextTurnPlayer.user.username });

        // Create View Cards button
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("view_cards")
            .setLabel("View Cards")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🎴")
        );

        const turnEmbed = new EmbedBuilder()
          .setColor(CONFIG.colors.primary)
          .setTitle("⏭️ Next Turn")
          .setDescription(`It's your turn, <@${nextTurnPlayer.user.id}>!`)
          .addFields(
            {
              name: "❤️ Health",
              value: `${nextTurnPlayer.health}`,
              inline: true,
            },
            {
              name: "🎴 Cards in Hand",
              value: `${nextTurnPlayer.hand.length}`,
              inline: true,
            }
          );

        await message.channel.send({
          embeds: [turnEmbed],
          components: [row],
        });
      }
    } catch (error) {
      logger.error("Error playing card", error);
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle("❌ Error")
        .setDescription(error.message);

      await message.reply({ embeds: [errorEmbed] });
    }
  },
};
