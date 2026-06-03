import { Component, inject, signal, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/* ============================= */
/* Goal Comments */
/* ============================= */
const comments = [
  "What a fantastic goal! 🔥",
  "Top corner finish! Unstoppable!",
  "GOAL!!! Crowd goes wild!",
  "Brilliant strike! ⚽",
  "Clinical finish... pure class!",
  "Waaaah",
  "What a moment in the game!"
];

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './match-detail.html',
  styleUrl: './match-detail.css',
})
export class MatchDetail implements OnInit {

  /* ============================= */
  /* Services */
  /* ============================= */
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(Api);

  /* ============================= */
  /* State Variables */
  /* ============================= */

  // Match data (Signal)
  match = signal<any | null>(null);

  // Scores
  scoreA: number | null = null;
  scoreB: number | null = null;

  // Selected team
  selectedTeam: string = '';

  // Messages
  message = '';
  goalComment = '';

  // Goal states
  showGoalToast = false;
  goal = false;

  // User
  employeeId = 0;

  /* ============================= */
  /* On Init */
  /* ============================= */
  ngOnInit() {

    // Read route params
    const matchId = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeId = Number(this.route.snapshot.paramMap.get('userId'));

    // Prepare request
    const data = {
      MatchId: matchId,
      EmployeeId: this.employeeId
    };

    // Call API
    this.api.getMatch(data).subscribe({

      next: (res: any) => {

        // Format response
        const formatted = {
          matchId: res.matchId,

          teamA: res.teamA,
          teamAId: res.teamAId,
          playerA: '/' + res.playerA,
          teamAFlag: '/' + res.teamAFlag,

          teamB: res.teamB,
          teamBId: res.teamBId,
          playerB: '/' + res.playerB,
          teamBFlag: '/' + res.teamBFlag,
        };

        // Load previous prediction if exists
        if (res.isPredicted) {
          this.scoreA = res.teamAScore;
          this.scoreB = res.teamBScore;
          this.goal = res.isPredicted;
        }

        // Set signal value
        this.match.set(formatted);

        console.log("Signal match:", this.match());
      },

      error: (err) => console.error(err)
    });
  }

  /* ============================= */
  /* Navigation */
  /* ============================= */
  goToBack() {
    this.router.navigate(['']);
  }

  /* ============================= */
  /* Select Winner & Save Prediction */
  /* ============================= */
  selectWinner() {

    // Validate scores
    if (this.scoreA == null || this.scoreB == null) {
      this.message = "Please enter both scores";
      return;
    }

    this.message = "";
    this.goalComment = "Match Completed";
    this.goal = true;
    this.showGoalToast = false;

    // Determine winner
    let winnerId = 0;

    if (this.scoreA > this.scoreB) {
      winnerId = this.match()?.teamAId;
    }
    else if (this.scoreB > this.scoreA) {
      winnerId = this.match()?.teamBId;
    }else{
      winnerId =1;
    }

    // Prepare payload
    const payload = {
      UserId: this.employeeId,
      MatchId: this.match()?.matchId,
      PredictedTeamAScore: this.scoreA,
      PredictedTeamBScore: this.scoreB,
      PredictedWinnerId: winnerId
    };

    // Call API to save prediction
    this.api.savePrediction(payload).subscribe({
      next: () => {
        this.goalComment = "Match Completed";
        this.goal = true;
        this.showGoalToast = false;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  /* ============================= */
  /* Goal Animation Trigger */
  /* ============================= */
  onMouseChange() {
    this.goalComment = comments[Math.floor(Math.random() * comments.length)];
    this.goal = false;
    this.showGoalToast = true;
  }

  /* ============================= */
  /* Disable Keyboard Input */
  /* ============================= */
  disableTyping(event: KeyboardEvent) {
    event.preventDefault(); // block manual typing
  }

}
