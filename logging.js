import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Logging file only accessable to developers
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logFilePath = path.join(__dirname, 'activity.log');

export function logActivity(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error('Error accessing log:', err);
    });
}
