import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'home-root',
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
  })
  export class HomeComponent {
    // Component logic here
  }
