import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { Admin } from '../admin/admin';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-list.html',
  styleUrl: './match-list.css',
})
export class MatchList {

  // Inject services
  private api = inject(Api);
  private router = inject(Router);

  showAdminDialog = signal(false);
  isAdminUser = signal(false);

  // Username signal
  username = signal<string>('Guest');

  // Matches signal (auto reactive)
  matches = toSignal(
    this.api.getUser().pipe(

      // Get username first
      switchMap((res: any) => {
        this.username.set(res.split('\\')[1]);

        
// Call admin check
      this.api.isAdmin(Number(this.username())).subscribe(isAdmin => {
        debugger;
        this.isAdminUser.set(isAdmin);
      });

        // Then fetch matches
        return this.api.getMatches();
      }),

      // Transform match data
      map((res: any[]) =>
        res.map((m: any) => ({
          ...m,

          // Fix flag paths
          teamAFlag: '/' + m.teamAFlag,
          teamBFlag: '/' + m.teamBFlag,

          // Keep match time
          matchTime: m.matchTime
        }))
      )
    ),
    { initialValue: [] }
  );

  // Animation states
  ballMoved = false;
  showLegend = false;
  dialog: any;

  // Start animation
  startAnimation() {
    this.ballMoved = true;
    this.showLegend = true;

    setTimeout(() => {
      this.ballMoved = false;
      this.showLegend = false;
    }, 5000);
  }

  // Navigate to leaderboard
  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  // Navigate to history
  goToHistory() {
    this.router.navigate(['/history', this.username()]);
  }

  // Open match page
  openMatch(id: number) {
    this.router.navigate(['/match', id, this.username()]);
  }
    
  openAdmin() {
    this.router.navigate(['/scoreupdate']);
  
  }

  closeAdmin() {
    this.showAdminDialog.set(false);
  }


}
