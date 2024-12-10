import fs from 'fs';
import path from 'path';
import { ImageConfig } from '../constants/imageConfig.js';

export class ImageHandler {
  constructor() {
    this.ensureDirectoryStructure();
  }

  ensureDirectoryStructure() {
    const baseDir = path.join(process.cwd(), 'public', 'images', 'cards');
    
    // Create base directory if it doesn't exist
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    // Create category subdirectories
    Object.values(ImageConfig.categories).forEach(category => {
      const categoryPath = path.join(baseDir, category);
      if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath, { recursive: true });
      }
    });
  }

  saveCardImage(imageBuffer, filename, category) {
    const categoryPath = path.join(
      process.cwd(),
      'public',
      'images',
      'cards',
      category
    );
    
    const filePath = path.join(categoryPath, filename);
    
    try {
      fs.writeFileSync(filePath, imageBuffer);
      return true;
    } catch (error) {
      console.error('Error saving card image:', error);
      return false;
    }
  }

  getCardImagePath(card) {
    return path.join(
      'public',
      'images',
      'cards',
      card.category,
      card.imageUrl
    );
  }
}