import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard implements OnInit {

  // Services
  private router = inject(Router);
  private api = inject(Api);

  // State (Signal)
  leaderboard = signal<any[]>([]);

  // Lifecycle hook - called when component loads
  ngOnInit() {
    this.loadLeaderboard();
  }

  // Load leaderboard data from API
  loadLeaderboard() {
    this.api.getLeaderboard().subscribe({

      // Success response
      next: (res) => {

        // Format API response
        const formatted = res.map((m: any) => ({
          id: m.id,
          points: m.score
        }));

        // Update signal state
        this.leaderboard.set(formatted);

        console.log('Leaderboard:', this.leaderboard());
      },

      // Error handling
      error: (err) => {
        console.error(err);
      }

    });
  }

  // Navigate back to home page
  goToBack() {
    this.router.navigate(['']);
  }

}
