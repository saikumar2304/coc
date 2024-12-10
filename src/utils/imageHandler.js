import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { CONFIG } from './config.js';
import { logger } from './logger.js';

export class ImageHandler {
  constructor() {
    logger.info('Initializing ImageHandler');
    this.ensureDirectoryStructure();
  }

  ensureDirectoryStructure() {
    const categories = ['attack', 'heal', 'hybrid', 'special', 'chaos'];
    const baseDir = path.join(process.cwd(), 'public', 'images', 'cards');
    
    logger.debug('Creating directory structure', { baseDir, categories });

    try {
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
        logger.info('Created base directory', { path: baseDir });
      }

      categories.forEach(category => {
        const categoryPath = path.join(baseDir, category);
        if (!fs.existsSync(categoryPath)) {
          fs.mkdirSync(categoryPath, { recursive: true });
          logger.info('Created category directory', { category, path: categoryPath });
        }
      });
    } catch (error) {
      logger.error('Failed to create directory structure', error);
      throw error;
    }
  }

  formatImageName(name) {
    const formatted = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    logger.debug('Formatted image name', { original: name, formatted });
    return formatted;
  }

  async processAndSaveImage(imageBuffer, name, category) {
    const formattedName = this.formatImageName(name);
    const filename = `${formattedName}.png`;
    const categoryPath = path.join(
      process.cwd(),
      'public',
      'images',
      'cards',
      category.toLowerCase()
    );
    
    logger.info('Processing image', { 
      filename,
      category,
      size: imageBuffer.length,
      path: categoryPath
    });
    
    try {
      logger.debug('Starting image processing with sharp');
      const processedImage = await sharp(imageBuffer)
        .resize(
          CONFIG.imageConfig.dimensions.card.width,
          CONFIG.imageConfig.dimensions.card.height,
          {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          }
        )
        .png()
        .toBuffer();

      const filePath = path.join(categoryPath, filename);
      logger.debug('Saving processed image', { path: filePath });
      
      await fs.promises.writeFile(filePath, processedImage);
      logger.info('Successfully saved image', { path: filePath });
      
      return {
        success: true,
        filename,
        path: filePath
      };
    } catch (error) {
      logger.error('Failed to process and save image', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  getImagePath(category, name) {
    const formattedName = this.formatImageName(name);
    const path = path.join('public', 'images', 'cards', category.toLowerCase(), `${formattedName}.png`);
    logger.debug('Getting image path', { category, name, path });
    return path;
  }

  validateImage(file) {
    logger.debug('Validating image', { 
      size: file.size,
      type: file.contentType
    });

    if (file.size > CONFIG.imageConfig.maxSize) {
      logger.error('Image size validation failed', {
        size: file.size,
        maxSize: CONFIG.imageConfig.maxSize
      });
      return {
        valid: false,
        error: `File size must be less than ${CONFIG.imageConfig.maxSize / 1024 / 1024}MB`
      };
    }

    if (!CONFIG.imageConfig.allowedTypes.includes(file.contentType)) {
      logger.error('Image type validation failed', {
        type: file.contentType,
        allowedTypes: CONFIG.imageConfig.allowedTypes
      });
      return {
        valid: false,
        error: `File type must be one of: ${CONFIG.imageConfig.allowedTypes.join(', ')}`
      };
    }

    logger.info('Image validation successful');
    return { valid: true };
  }
}