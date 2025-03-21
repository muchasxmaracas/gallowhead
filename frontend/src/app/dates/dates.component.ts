import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';


interface Concert {
    date: string;
    venue: string;
    info: string;
    active: boolean;
    city: string;
    country: string;
    lineup: string;
    tickets: string;
}

interface SheetResponse {
    values: string[][];
}

@Component({
    selector: 'app-dates',
    templateUrl: './dates.component.html',
    styleUrls: ['./dates.component.css'],
    standalone: true,
    imports: [CommonModule, HttpClientModule],
})
export class DatesComponent implements OnInit {
    concertData: Concert[] = [];

    private sheetId: string = environment.googleSheetId;
    private range: string = 'A1:Z100';

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.fetchConcertData();
    }

    toggleConcert(concert: Concert, event: Event) {
        event.stopPropagation();

        this.concertData.forEach((c) => {
            if (c !== concert) c.active = false;
        });

        concert.active = !concert.active;
    }

    fetchConcertData() {
        const url = `http://localhost:3000/api/sheet-data?sheetId=${this.sheetId}&range=${this.range}`;

        this.http.get<SheetResponse>(url).subscribe({
            next: (response: SheetResponse) => this.processSheetData(response),
            error: (error: any) => console.error('Error fetching concert data:', error),
        });
    }

    private assignConcertValue(concert: Concert, key: string, value: string) {
        switch (key) {
            case 'date':
                concert.date = value;
                break;
            case 'venue':
                concert.venue = value;
                break;
            case 'info':
                concert.info = value;
                break;
            case 'city':
                concert.city = value;
                break;
            case 'country':
                concert.country = value;
                break;
            case 'lineup':
                concert.lineup = value;
                break;
            case 'tickets':
                concert.tickets = value;
                break;
        }
    }

    processSheetData(response: SheetResponse) {
        if (response.values && response.values.length > 1) {
            const headers: string[] = response.values[0];
            this.concertData = response.values.slice(1).map((row: string[]) => {
                const concert: Concert = {
                    date: '',
                    venue: '',
                    info: '',
                    active: false,
                    city: '',
                    country: '',
                    lineup: '',
                    tickets: '',
                };
                headers.forEach((header: string, index: number) => {
                    const headerLower = header.toLowerCase();
                    this.assignConcertValue(concert, headerLower, row[index] || '');
                });
                return concert;
            });
        }
    }
}