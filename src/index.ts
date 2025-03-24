import * as path from 'path';
import dotenv from 'dotenv';
import { Server } from './server';
import { SchedulerService } from './services/schedulerService';

// Load environment variables
dotenv.config();

// Initialize server
const PORT = parseInt(process.env.PORT || '3000', 10);
const server = new Server(PORT);
server.start();

// Initialize scheduler
const folksDataPath = path.join(__dirname, '..', 'data', 'folks.json');
const scheduler = new SchedulerService(folksDataPath);
scheduler.startScheduler();
