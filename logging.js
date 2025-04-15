import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Logging file only accessable to developers
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logFilePath = path.join(__dirname, 'activity.log');

// Max log file size in bytes before rotating
const maxLogSize = 5*1024*1024

// Fuction to rotate log files when size exceeds limit
function rotateLog() {
    const currentDate = new Date().toISOString().slice(0,10); // Format: YYYY-MM-DD
    const rotatedFilePath = path.join(__dirname, `activity-${currentDate}.log`);

    fs.rename(logFilePath, rotatedFilePath, (err) => {
        if (err) {
            console.error('Error rotating log file:', err);
        } else {
            console.log(`Log rotated to: ${rotatedFilePath}`);
            // Create a new empty log file after rotation
            fs.closeSync(fs.openSync(logFilePath, 'w'));
        }
    });
}

// Function to check the log file size and rotate if needed
function checkLogSize() {
    fs.stat(logFilePath, (err, stats) => {
        if (err) {
            console.error('Error checking log file size:', err);
        } else if (stats.size > maxLogSize) {
            rotateLog();
        }
    });
}

export function logActivity(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    checkLogSize(); //Check log file size before appending
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error('Error accessing log:', err);
    });
}

export function logActivityJSON(message, level = 'INFO') {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level: level,
        message: message
    };
    checkLogSize();
    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error('Error accessing log:', err);
        }
    });
}
