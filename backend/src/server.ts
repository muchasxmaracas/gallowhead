import express, { Request, Response, RequestHandler } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

// API key stored securely as an environment variable
const API_KEY = process.env['GOOGLE_SHEETS_API_KEY'];

// Enable CORS for your Angular frontend
app.use(cors({
    origin: process.env['FRONTEND_URL'] || 'http://localhost:4200' || 'https://test.gallowhead.com' || 'https://gallowhead.com'
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

// Endpoint to fetch Google Sheets data
const sheetDataHandler: RequestHandler<{}, {}, {}, SheetDataQuery> = async (req, res) => {
    const sheetId = req.query.sheetId;
    const range = req.query.range || 'A1:Z100';

    if (!sheetId) {
        res.status(400).json({ error: 'Sheet ID is required' });
        return; // Important: Return to prevent further execution
    }

    if (!API_KEY) {
        res.status(500).json({ error: 'API key not configured' });
        return; // Important: Return to prevent further execution
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