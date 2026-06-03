import { Component, inject, signal, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

  private api = inject(Api);

  // Store pending matches
  pendingMatches = signal<any[]>([]);

  ngOnInit() {
    this.loadMatches();
  }

  // Load pending matches
  loadMatches() {
    this.api.getPendingMatches().subscribe({
      next: (res: any[]) => {
        // Add local fields for scores
        const data = res.map(m => ({
          ...m,
          teamAScore: null,
          teamBScore: null
        }));

        this.pendingMatches.set(data);
      },
      error: (err) => console.error(err)
    });
  }

  // Submit result
  submitResult(m: any) {

    // Validation
    if (m.teamAScore == null || m.teamBScore == null) {
      alert('Enter both scores');
      return;
    }

    // Determine winner
    let winnerId = 0;

    if (m.teamAScore > m.teamBScore) {
      winnerId = m.teamAId;
    } else if (m.teamBScore > m.teamAScore) {
      winnerId = m.teamBId;
    }else{
      winnerId =1;
    }

    // Prepare payload
    const payload = {
      MatchId: m.matchId,
      TeamAScore: m.teamAScore,
      TeamBScore: m.teamBScore,
      WinnerTeamId: winnerId
    };

    // Call API
    this.api.updateMatchResult(payload).subscribe({
      next: () => {
        alert('Result Updated ✅');

        // Refresh list (remove completed match)
        this.loadMatches();
      },
      error: (err) => console.error(err)
    });
  }


}
