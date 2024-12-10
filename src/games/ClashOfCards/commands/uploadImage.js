import { EmbedBuilder } from 'discord.js';
import sharp from 'sharp';
import { CONFIG } from '../../../utils/config.js';
import { ImageConfig } from '../constants/imageConfig.js';

export const uploadImage = {
  name: 'uploadimage',
  description: 'Upload a card image (Event Manager only)',
  execute: async (message) => {
    // Check if user is event manager
    if (!CONFIG.owners.includes(message.author.id)) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Permission Denied')
        .setDescription('Only Event Managers can upload card images!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    // Check for attachment
    const attachment = message.attachments.first();
    if (!attachment) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Missing Image')
        .setDescription('Please attach an image file!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    // Get category and card name from command
    const args = message.content.split(' ').slice(1);
    const category = args[0]?.toLowerCase();
    const cardName = args.slice(1).join('-').toLowerCase() + '.png';

    if (!ImageConfig.categories[category]) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Invalid Category')
        .setDescription(`Valid categories: ${Object.keys(ImageConfig.categories).join(', ')}`);
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    try {
      // Download image
      const response = await fetch(attachment.url);
      const imageBuffer = Buffer.from(await response.arrayBuffer());

      // Process image with sharp
      const processedImage = await sharp(imageBuffer)
        .resize(ImageConfig.dimensions.width, ImageConfig.dimensions.height, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();

      // Save image
      const imagePath = `public/images/cards/${category}/${cardName}`;
      await sharp(processedImage).toFile(imagePath);

      const successEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.success)
        .setTitle('✅ Image Uploaded')
        .setDescription(`Successfully uploaded image for ${cardName} in ${category} category!`)
        .setImage(`attachment://${cardName}`);

      await message.reply({ 
        embeds: [successEmbed],
        files: [{
          attachment: processedImage,
          name: cardName
        }]
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Upload Failed')
        .setDescription('Failed to process and save the image. Please try again.');
      
      await message.reply({ embeds: [errorEmbed] });
    }
  }
};