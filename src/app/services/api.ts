import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {

  private http = inject(HttpClient);
  // baseUrl = 'https://localhost:44348/';
  // baseUrl='https://wcappfifa.runasp.net/';

  getUser() {
    return this.http.get(`${environment.apiUrl}api/user/me`, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  getMatch(data: any) {
    return this.http.get(
      `${environment.apiUrl}api/fifa/matche`,
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
      `${environment.apiUrl}api/fifa/predictions`,
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
      `${environment.apiUrl}api/fifa/leaderboard`,
      { withCredentials: true }
    );
  }

  getMatches() {
    return this.http.get<any>(
      `${environment.apiUrl}api/fifa/matches`,
      { withCredentials: true }
    );
  }

  getHistory(employeeid: number) {
    return this.http.get<any>(
      `${environment.apiUrl}api/fifa/history/${employeeid}`,
      { withCredentials: true }
    );
  }
  
  isAdmin(userId: number) {
    return this.http.get<boolean>(
      `${environment.apiUrl}api/fifa/isadmin/${userId}`,
      { withCredentials: true }
    );
  }

  
  getPendingMatches() {
    return this.http.get<any>(
      `${environment.apiUrl}api/fifa/pending`,
      { withCredentials: true }
    );
  }

updateMatchResult(data: any) {
  return this.http.get(
    `${environment.apiUrl}api/fifa/updatematch`,
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

checkEmployee(id: string) {
  return this.http.get<boolean>(`${environment.apiUrl}api/user/exists/${id}`,
    { withCredentials: true }
  );
}

// login(id: string, password: string) {
//   return this.http.get<boolean>(`${environment.apiUrl}api/user/login`, 
//     { 
//       params: {  
//           id:id,
//           password:password
//         },
//        withCredentials: true });
// }

  async login(email: string, pasword: string) {
  const tenantId = "YOUR_TENANT_ID";
  const clientId = "YOUR_CLIENT_ID";
  const clientSecret = "YOUR_CLIENT_SECRET"; // Only for backend apps
  const username = email;
  const password = pasword;
 
  const tokenUrl =
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
 
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "password",
    username: username,
    password: password,
    scope: "https://graph.microsoft.com/.default",
  });
 
  // Get access token
  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
 
  const tokenData = await tokenResponse.json();
 
  if (!tokenResponse.ok) {
    throw new Error(JSON.stringify(tokenData));
  }
 
  const accessToken = tokenData.access_token;
 
  // Get user details
  const graphResponse = await fetch(
    "https://graph.microsoft.com/v1.0/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
 
  const userData = await graphResponse.json();
 
  console.log("User Details:", userData);
  return userData;
}



register(data: any) {
    return this.http.get(
    `${environment.apiUrl}api/user/register`,
     {
       params: {  
          EmployeeId:data.employeeId,
          Email:data.email,
          Password:data.password
        },
       withCredentials: true 
      }
  );
}

}
