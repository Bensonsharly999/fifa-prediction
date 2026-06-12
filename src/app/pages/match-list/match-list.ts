import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthPopup } from '../auth-popup/auth-popup';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-list.html',
  styleUrl: './match-list.css',
})
export class MatchList implements OnInit {

  // ✅ Inject services
  private api = inject(Api);
  private router = inject(Router);
  private popup = inject(MatDialog);

  // ✅ Signals
  username = signal<string>('Guest');
  matches = signal<any[]>([]);
  isAdminUser = signal(false);

  // ✅ Page load → open login
  // ngOnInit() {
  //   debugger;
  //   const savedUser = localStorage.getItem('empId'); 
  //   if (!savedUser) {
  //   this.openAuthPopup();
  //   }
  // }
  ngOnInit() {
    const empId = localStorage.getItem('empId');
    // const loginTime = localStorage.getItem('loginTime');

    // const now = new Date().getTime();

    // // ✅ 1 hour session (3600000 ms)
    // const sessionLimit = 60 * 60 * 1000;

    // if (empId && loginTime && (now - Number(loginTime)) < sessionLimit) {
   if(empId){
      // ✅ Valid session
      this.afterLogin(empId);

    } else {

      // ✅ Session expired
      localStorage.removeItem('empId');
      localStorage.removeItem('loginTime');

      this.openAuthPopup();
    }
  } 


afterLogin(employeeId: string) {

  this.username.set(employeeId);

  // ✅ Admin check
  this.api.isAdmin(Number(employeeId)).subscribe(isAdmin => {
    this.isAdminUser.set(isAdmin);
  });

  // ✅ Load matches
  this.loadMatches();
}



  // ✅ Open login dialog
  openAuthPopup() {
    this.popup.open(AuthPopup, {
      width: '320px',
      disableClose: true
    }).afterClosed().subscribe((employeeId) => {
      if (!employeeId) return;
      // ✅ Set username
      this.username.set(employeeId);
      localStorage.setItem('empId', employeeId);

      // ✅ Check admin
      this.api.isAdmin(Number(employeeId)).subscribe(isAdmin => {
        this.isAdminUser.set(isAdmin);
      });

      // ✅ Load matches
      this.loadMatches();
    });
  }

  // ✅ Load matches
  loadMatches() {
    this.api.getMatches().subscribe((res: any[]) => {
      
      const formatted = res.map((m: any) => {

          return {
            ...m,
            teamAFlag: '/' + m.teamAFlag,
            teamBFlag: '/' + m.teamBFlag,
            matchTime: m.matchTime   // ✅ FIXED
          };
        });

      this.matches.set(formatted);
    });
  }

  // ✅ UI actions
  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  goToHistory() {
    this.router.navigate(['/history', this.username()]);
  }

  openMatch(id: number) {
    this.router.navigate(['/match', id, this.username()]);
  }

  openAdmin() {
    this.router.navigate(['/scoreupdate']);
  }

  // ✅ Animation (unchanged)
  ballMoved = false;
  showLegend = false;

  startAnimation() {
    this.ballMoved = true;
    this.showLegend = true;

    setTimeout(() => {
      this.ballMoved = false;
      this.showLegend = false;
    }, 5000);
  }
  
logout() {
  // clear session / token
  localStorage.clear();

  // redirect to login page
  
  this.router.navigate(['']).then(() => {
      window.location.reload();   // ✅ refresh after redirect
    });
}
canPredict(matchTime: string): boolean {
  const now = new Date().getTime();
  const match = new Date(matchTime).getTime();

  const next2Hours = now + (2 * 60 * 60 * 1000);

  return !(match >= now && match <= next2Hours);
}


}