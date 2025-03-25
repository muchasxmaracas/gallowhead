import express, { Request, Response, RequestHandler } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

// API key stored securely as an environment variable
const API_KEY = process.env['GOOGLE_SHEETS_API_KEY'];

// Enable CORS for Angular frontend
app.use(cors({
    origin: ['https://test.gallowhead.com', 'https://gallowhead.com', 'http://localhost:4200'],
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


// Type definitions
interface SheetResponse {
    values: any[][];
    range: string;
    majorDimension: string;
}

// Query parameters interface
interface SheetDataQuery {
    sheetId: string;
    range?: string;
}

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response): Promise<void> => {
    try {
        if (!API_KEY) {
            res.status(500).json({ status: 'error', message: 'API key missing' });
            return;
        }

        // Using a test sheet ID from the request OR a default one
        const sheetId = req.query.sheetId as string || '1gDfUM4yBIF4VJDDQp644w0cTxJ7MDP5soGqa9Biq9VY';
        const range = 'A1:A1';
        const sheetsURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${API_KEY}`;

        const googleResponse = await axios.get(sheetsURL);

        res.json({
            status: 'ok',
            googleSheetsAPI: googleResponse.status === 200 ? 'reachable' : 'unreachable'
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ status: 'error', message: 'Google Sheets API unreachable' });
    }
});

// Fetch Google Sheets data endpoint
const sheetDataHandler: RequestHandler<{}, {}, {}, SheetDataQuery> = async (req, res) => {
    const sheetId = req.query.sheetId;
    const range = req.query.range || 'A1:Z100';

    if (!sheetId) {
        res.status(400).json({ error: 'Sheet ID is required' });
        return;
    }

    if (!API_KEY) {
        res.status(500).json({ error: 'API key not configured' });
        return;
    }

    try {
        const response = await axios.get<SheetResponse>(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
            { params: { key: API_KEY } }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        res.status(500).json({
            error: 'Failed to fetch data from Google Sheets',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

app.get('/api/sheet-data', sheetDataHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
