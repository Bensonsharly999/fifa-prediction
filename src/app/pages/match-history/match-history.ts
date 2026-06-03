import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match-history',
  imports: [CommonModule],
  templateUrl: './match-history.html',
  styleUrl: './match-history.css',
})
export class MatchHistory implements OnInit {

  /* ============================= */
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(Api);

  // Signal (state)
  results = signal<any[]>([]);
 ngOnInit() {
    const employeeid = Number(this.route.snapshot.paramMap.get('userId'));
    this.loadResults(employeeid);   // ✅ call API here
  }
  loadResults(employeeid: number) {
  this.api.getHistory(employeeid).subscribe({
    next: (res: any[]) => {

      const formatted = res.map((m: any) => {

        const isCorrect =
          m.predictedScoreA === m.actualScoreA &&
          m.predictedScoreB === m.actualScoreB;

        return {
          teamA: m.teamA,
          teamB: m.teamB,
          predictedA: m.predictedA,
          predictedB: m.predictedB,
          actualA: m.actualA,
          actualB: m.actualB,
          isCorrect: isCorrect,
          points: isCorrect ? m.points : 0
        };
      });

      this.results.set(formatted);
    },
    error: (err) => console.error(err)
  });
}
  goToBack(){
    this.router.navigate(['']);
  }

}
