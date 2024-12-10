import { EmbedBuilder } from 'discord.js';
import { ImageHandler } from '../utils/imageHandler.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

const imageHandler = new ImageHandler();

export const uploadImage = {
  name: 'uploadimage',
  description: 'Upload a card image (Admin only)',
  execute: async (message, args) => {
    logger.info('Upload image command received', {
      user: message.author.tag,
      args
    });

    // Check if user is admin
    if (!CONFIG.owners.includes(message.author.id)) {
      logger.error('Permission denied', { userId: message.author.id });
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Permission Denied')
        .setDescription('Only administrators can upload card images!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    // Check for attachment
    const attachment = message.attachments.first();
    if (!attachment) {
      logger.error('No attachment provided');
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Missing Image')
        .setDescription('Please attach an image file!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    // Get category and card name from command
    const [category, ...nameWords] = args;
    const cardName = nameWords.join('-');

    logger.debug('Processing upload request', {
      category,
      cardName,
      attachment: {
        url: attachment.url,
        size: attachment.size,
        contentType: attachment.contentType
      }
    });

    if (!['attack', 'heal', 'hybrid', 'special', 'chaos'].includes(category?.toLowerCase())) {
      logger.error('Invalid category provided', { category });
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Invalid Category')
        .setDescription('Valid categories: attack, heal, hybrid, special, chaos');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    try {
      logger.debug('Downloading image from URL', { url: attachment.url });
      const response = await fetch(attachment.url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const imageBuffer = Buffer.from(await response.arrayBuffer());
      logger.debug('Image downloaded successfully', { size: imageBuffer.length });

      // Process and save image
      const result = await imageHandler.processAndSaveImage(imageBuffer, cardName, category);

      if (result.success) {
        logger.info('Image upload successful', { 
          filename: result.filename,
          path: result.path
        });

        const successEmbed = new EmbedBuilder()
          .setColor(CONFIG.colors.success)
          .setTitle('✅ Image Uploaded')
          .setDescription(`Successfully saved image as: ${result.filename}`)
          .setImage(`attachment://${result.filename}`);

        await message.reply({ 
          embeds: [successEmbed],
          files: [{ 
            attachment: result.path,
            name: result.filename
          }]
        });
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      logger.error('Failed to upload image', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Upload Failed')
        .setDescription(`Error: ${error.message}`);
      
      await message.reply({ embeds: [errorEmbed] });
    }
  }
};