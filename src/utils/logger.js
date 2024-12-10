import fs from 'fs';
import path from 'path';

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}\n${JSON.stringify(data, null, 2)}\n`;
  }

  log(level, message, data = {}) {
    const formattedMessage = this.formatMessage(level, message, data);
    console.log(formattedMessage);
    
    const logFile = path.join(this.logDir, `${level.toLowerCase()}.log`);
    fs.appendFileSync(logFile, formattedMessage);
  }

  error(message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : {};
    this.log('ERROR', message, errorData);
  }

  warn(message, data = {}) {
    this.log('WARN', message, data);
  }

  info(message, data = {}) {
    this.log('INFO', message, data);
  }

  debug(message, data = {}) {
    this.log('DEBUG', message, data);
  }
}

export const logger = new Logger();