import { Routes } from '@angular/router';
import { MatchList } from './pages/match-list/match-list';
// import { MatchDetail } from './pages/match-detail/match-detail';
import { Leaderboard } from './pages/leaderboard/leaderboard';
// import { MatchHistory } from './pages/match-history/match-history';
import { Admin } from './pages/admin/admin';


export const routes: Routes = [
  { path: '', component: MatchList },
  {
  path: 'match/:id/:userId',
  loadComponent: () =>
    import('./pages/match-detail/match-detail')
      .then(m => m.MatchDetail),
  },
  // { path: 'match/:id/:userId', component: MatchDetail },
  { path: 'leaderboard', component: Leaderboard},
  {
    path: 'history/:userId',
    loadComponent: () =>
      import('./pages/match-history/match-history')
        .then(m => m.MatchHistory)
  },
  // {path:'history/:userId',component: MatchHistory},
  {path:'scoreupdate',component: Admin},

];
