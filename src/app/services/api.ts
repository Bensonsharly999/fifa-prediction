import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {

  private http = inject(HttpClient);
  baseUrl = 'https://localhost:44348/';

  getUser() {
    return this.http.get(`${this.baseUrl}api/user/me`, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  getMatch(data: any) {
    return this.http.get(
      `${this.baseUrl}api/fifa/matche`,
      {
        params: {
          MatchId: data.MatchId,
          EmployeeId: data.EmployeeId
        },
        withCredentials: true
      }
    );
  }

  // ✅ FIXED
  savePrediction(data: any) {
    return this.http.get(
      `${this.baseUrl}api/fifa/predictions`,
      {
       params: {
          UserId: data.UserId,
          MatchId: data.MatchId,
          PredictedWinnerId:data.PredictedWinnerId,
          PredictedTeamAScore:data.PredictedTeamAScore,
          PredictedTeamBScore:data.PredictedTeamBScore
        },
       withCredentials: true 
      }
    );
  }

  getLeaderboard() {
    return this.http.get<any[]>(
      `${this.baseUrl}api/fifa/leaderboard`,
      { withCredentials: true }
    );
  }

  getMatches() {
    return this.http.get<any>(
      `${this.baseUrl}api/fifa/matches`,
      { withCredentials: true }
    );
  }

  getHistory(employeeid: number) {
    return this.http.get<any>(
      `${this.baseUrl}api/fifa/history/${employeeid}`,
      { withCredentials: true }
    );
  }
  
  isAdmin(userId: number) {
    return this.http.get<boolean>(
      `${this.baseUrl}api/fifa/isadmin/${userId}`,
      { withCredentials: true }
    );
  }

  
  getPendingMatches() {
    return this.http.get<any>(
      `${this.baseUrl}api/fifa/pending`,
      { withCredentials: true }
    );
  }

updateMatchResult(data: any) {
  return this.http.get(
    `${this.baseUrl}api/fifa/updatematch`,
     {
       params: {  
          TeamAScore:data.TeamAScore,
          TeamBScore:data.TeamBScore,
          WinnerId:data.WinnerTeamId,
          MatchId: data.MatchId,
        },
       withCredentials: true 
      }
  );
}


}
