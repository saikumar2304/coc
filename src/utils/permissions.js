import { CONFIG } from './config.js';
import { logger } from './logger.js';

export const checkPermissions = (userId, requiredPermission) => {
  logger.debug('Checking permissions', { 
    userId, 
    requiredPermission,
    owners: CONFIG.owners 
  });

  switch (requiredPermission) {
    case 'OWNER':
      return CONFIG.owners.includes(userId);
    case 'ADMIN':
      return CONFIG.owners.includes(userId);
    default:
      return true;
  }
};