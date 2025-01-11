import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'dates-root',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './dates.component.html',
    styleUrls: ['./dates.component.css'],
  })
  export class DatesComponent {
    // Component logic here
  }
