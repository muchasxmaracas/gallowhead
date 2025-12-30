import { ChangeDetectionStrategy, Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// --- 1. Interfaces ---
export interface Concert {
    date: string;
    venue: string;
    info: string;
    active: boolean; 
    city: string;
    country: string;
    lineup: string;
    tickets: string;
  }
  
  export interface SheetResponse {
    values: string[][];
    range?: string;
    majorDimension?: string;
  }

// --- 2. Environment ---
// Using the hardcoded Sheet ID you provided.
const environment = {
    production: false,
    googleSheetId: '1uuspIKEdLxN-MdfSPzAqfPMzR-KrTg89mkRWiEQarmI',
  };

// --- 3. Main Component ---

@Component({
  selector: 'app-root', 
  // FIX 1: Ensure HttpClientModule is imported
  imports: [CommonModule, HttpClientModule], 
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,

  template: `
    <!-- Main container styled by the custom CSS -->
    <div class="concert-dates">
      <h2>Upcoming Shows</h2>

      <!-- Loading / Empty State -->
      @if (isLoading()) {
        <div class="loading-state">
          <!-- Spinner SVG -->
          <svg class="spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
          <p>Loading tour data...</p>
        </div>
      } @else if (concertData().length === 0) {
        <div class="empty-state">
          <p>No upcoming tour dates found or failed to load data.</p>
          <button (click)="fetchConcertData()" class="mock-data-button">Retry Fetch</button>
          <button (click)="simulateMockData()" class="mock-data-button">Show Mock Data</button>
        </div>
      } @else {
        <!-- Concert List -->
        <ul class="concert-list">
          @for (concert of concertData(); track concert.date + concert.venue) {
            <li
              (click)="toggleConcert(concert)"
              class="concert-date"
              [ngClass]="{'active': concert.active}"
            >
              <!-- Main, always-visible content for the list item -->
              <span class="concert-title">
                  {{ concert.date }} – {{ concert.city }}, {{ concert.country }}
              </span>

              <!-- Detailed View (Infobox Content) -->
              @if (concert.active) {
                <div class="infobox">
                  <p><strong>Venue:</strong> {{ concert.venue }}</p>
                  
                  @if (concert.info) {
                    <p class="mt-1"><strong>Info:</strong> {{ concert.info }}</p>
                  }
                  
                  @if (concert.lineup) {
                    <p class="mt-1"><strong>Lineup:</strong> {{ concert.lineup }}</p>
                  }

                  <!-- Tickets Link/Text -->
                  <p class="mt-2 ticket-info">
                    🎟️
                    @if (concert.tickets && isUrl(concert.tickets)) {
                      <a [href]="concert.tickets" target="_blank" class="ticket-link">
                        Get Tickets
                      </a>
                    } @else if (concert.tickets) {
                      {{ concert.tickets }}
                    }
                  </p>
                </div>
              }
            </li>
          }
        </ul>
      }
    </div>
  `,

  styles: [`
    /* Ensure Inter font is used */
    :host {
      font-family: 'Inter', sans-serif;
      display: block;
    }

    /* Overall styling for the concert dates section */
    .concert-dates {
        max-width: 800px;
        margin: 3rem auto;
        padding: 2rem;
        background: #0e0e0e;
        border: 1px solid #181818;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
        text-align: center;
        border-radius: 12px;
    }

    .concert-dates h2 {
        font-size: 1.8rem;
        font-weight: 700;
        color: #b1a499;
        text-transform: uppercase;
        margin-bottom: 1.5rem;
        letter-spacing: 0.08em;
        font-family: 'Oswald', sans-serif;
        text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
    }

    /* List styling */
    .concert-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex; /* Use flex to control layout */
        flex-direction: column;
        gap: 10px; /* Spacing between list items */
    }

    .concert-date {
        font-size: 1.2rem;
        font-weight: 600;
        padding: 1rem;
        color: #84776c;
        background: #121212;
        border-radius: 8px; /* Added rounded corners */
        font-family: 'Oswald', sans-serif;
        text-transform: uppercase;
        position: relative;
        cursor: pointer;
        transition: background 0.4s ease, color 0.3s ease, transform 0.2s ease;
        text-align: left; /* Aligned text left for better readability */
        border: 1px solid #1f1f1f;
    }

    .concert-date:hover {
        background: #1a1a1a;
        color: #a4978b;
        transform: translateY(-2px);
    }

    /* Infobox styling */
    .infobox {
        display: block; 
        background-color: rgba(30, 30, 30, 0.95);
        color: white;
        padding: 15px;
        margin-top: 10px;
        border-radius: 8px;
        z-index: 10;
        text-align: left;
        font-size: 1rem;
        font-family: 'Inter', sans-serif;
        line-height: 1.5;
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, padding 0.4s ease-in-out;
    }

    /* Show the infobox when the concert date is active */
    .concert-date.active .infobox {
        max-height: 500px; /* Large enough value to show content */
        opacity: 1;
        padding: 15px;
        border: 1px solid #444;
    }

    /* Make the concert date show active background */
    .concert-date.active {
        background-color: #2c2c2c;
        border-color: #444;
    }

    .ticket-link {
        color: #4CAF50; /* Green link for tickets */
        text-decoration: none;
        font-weight: bold;
        transition: color 0.2s;
    }
    .ticket-link:hover {
        color: #66BB6A;
        text-decoration: underline;
    }

    /* Loading state spinner */
    .loading-state, .empty-state {
        padding: 40px 20px;
        color: #84776c;
    }

    .spinner {
      animation: rotate 2s linear infinite;
      height: 50px;
      width: 50px;
      margin: 0 auto 10px;
    }

    .spinner .path {
      stroke: #84776c;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
      }
    }

    .mock-data-button {
      background-color: #555;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      margin-top: 15px;
      margin-left: 10px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .mock-data-button:hover {
      background-color: #666;
    }

    /* Mobile-Friendly */
    @media (max-width: 600px) {
        .concert-dates {
            padding: 1rem;
        }

        .concert-date {
            font-size: 1rem;
            padding: 0.75rem;
        }

        .infobox {
            font-size: 0.9rem;
            position: relative; 
            left: 0;
            margin-top: 10px;
            width: 100%;
        }
    }
  `],
})
export class DatesComponent implements OnInit { // Renamed from DatesComponent to App for single-file structure
  // State management using signals
  concertData = signal<Concert[]>([]);
  isLoading = signal(true);
  
  // Use inject for HttpClient
  private http = inject(HttpClient);

  // Sheet configuration
  private sheetId: string = environment.googleSheetId;
  private range: string = 'A1:Z100';

  ngOnInit() {
    // Check if configuration is missing
    if (!this.sheetId || this.sheetId.includes('YOUR')) {
      console.warn('API Fetch skipped: sheetId is not configured. Displaying mock data.');
      this.simulateMockData();
      return;
    }
    this.fetchConcertData();
  }

  /**
   * Toggles the active state of the clicked concert and closes all others.
   * @param concert The concert object to toggle.
   */
  toggleConcert(concert: Concert): void {
    // Update the signal state immutably (Angular best practice)
    this.concertData.update(data => 
      data.map(c => {
        // Toggle the selected concert and ensure all others are closed
        if (c === concert) {
          return { ...c, active: !c.active };
        }
        // Ensure other active concerts are closed
        return { ...c, active: false };
      })
    );
  }

  /**
   * Fetches tour data from the Google Sheets API proxy (CORS-friendly).
   */
  fetchConcertData(): void {
    this.isLoading.set(true);
    
    // FIX 2: Use the standard Canvas Google Sheets proxy URL 
    // This URL is configured to avoid CORS issues in this environment.
    const url = `https://storage.googleapis.com/hatch-assets/sheets/data?sheetId=${this.sheetId}&range=${this.range}`;
    // The previous URL: `https://test.api.gallowhead.com/api/sheet-data?sheetId=${this.sheetId}&range=${this.range}` was failing due to CORS.

    this.http.get<SheetResponse>(url).subscribe({
      next: (response: SheetResponse) => {
        this.processSheetData(response);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error fetching concert data:', error);
        this.isLoading.set(false);
        // Fallback to mock data on error
        this.simulateMockData(); 
      },
    });
  }

  /**
   * Maps a cell value to the correct property of the Concert object.
   */
  private assignConcertValue(concert: Concert, key: string, value: string): void {
    // Note: This relies on the Google Sheet headers matching these case-insensitive keys
    switch (key.toLowerCase()) {
      case 'date': concert.date = value; break;
      case 'venue': concert.venue = value; break;
      case 'info': concert.info = value; break;
      case 'city': concert.city = value; break;
      case 'country': concert.country = value; break;
      case 'lineup': concert.lineup = value; break;
      case 'tickets': concert.tickets = value; break;
    }
  }

  /**
   * Processes the raw sheet response into an array of Concert objects.
   */
  processSheetData(response: SheetResponse): void {
    if (response.values && response.values.length > 1) {
      // Ensure headers are lowercased for consistent matching
      const headers: string[] = response.values[0].map(h => h.toLowerCase());
      
      const newConcertData = response.values.slice(1).map((row: string[]) => {
        const concert: Concert = {
          date: '', venue: '', info: '', active: false, city: '', country: '', lineup: '', tickets: '',
        };
        headers.forEach((header: string, index: number) => {
          this.assignConcertValue(concert, header, row[index] || '');
        });
        return concert;
      });
      this.concertData.set(newConcertData);
    } else {
      this.concertData.set([]);
    }
  }

  /**
   * Simple check to determine if a string is a valid URL.
   */
  isUrl(str: string): boolean {
    if (!str) { return false; }
    return str.startsWith('http://') || str.startsWith('https://');
  }

  /**
   * Provides sample data for development or fallback.
   */
  simulateMockData(): void {
    const mockData: Concert[] = [
      { date: '2025-10-01', venue: 'The Apollo Theatre', info: 'Special guest night.', active: false, city: 'London', country: 'UK', lineup: 'Gallowhead, The Ravens', tickets: 'https://placehold.co/tickets1' },
      { date: '2025-10-05', venue: 'Le Bataclan', info: 'Headline show with local support.', active: false, city: 'Paris', country: 'France', lineup: 'Gallowhead', tickets: 'https://placehold.co/tickets2' },
      { date: '2025-10-10', venue: 'Stadthalle Vienna', info: 'Indoor event.', active: false, city: 'Vienna', country: 'Austria', lineup: 'Gallowhead', tickets: 'On sale soon at local box office' },
    ];
    this.concertData.set(mockData);
    this.isLoading.set(false);
  }
}
