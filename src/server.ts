import express from 'express';

export class Server {
  private app: express.Application;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/', (req, res) => {
      res.send('Auto WI Report Submission Server is running!');
    });
    
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
