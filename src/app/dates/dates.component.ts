import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dates',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.css']
})
export class DatesComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.addEventListeners();
    }
  }

  addEventListeners(): void {
    const concertDates = document.querySelectorAll('.concert-date');
    
    concertDates.forEach(item => {
      item.addEventListener('click', (event) => {
        event.stopPropagation();

        // Close all infoboxes first
        concertDates.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle the active class for the clicked item
        item.classList.toggle('active');
      });
    });

    // Close infobox when clicking outside of concert dates
    document.addEventListener('click', () => {
      concertDates.forEach(item => {
        item.classList.remove('active');
      });
    });
  }
}
