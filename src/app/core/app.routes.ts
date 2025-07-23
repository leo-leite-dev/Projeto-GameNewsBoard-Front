import { Routes } from '@angular/router';
import { SideMenuComponent } from '../shared/nav/side-menu/side-menu.component';
import { GameNewsComponent } from '../pages/game-news/game-news.component';
import { AllGamesListComponent } from '../pages/games/all-games-list/all-games-list.component';
import { GameManagementComponent } from '../pages/games/game-management/game-management.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AddGameTierListComponent } from '../pages/games/game-management/game-tier-list/add-game-tier-list/add-game-tier-list.component';
import { TierListFormComponent } from '../pages/games/game-management/game-tier-list/tier-list-form/tier-list-form.component';
import { GameReleasesComponent } from '../pages/game-releases/game-releases.component';
import { AllReleasesComponent } from '../pages/game-releases/all-releases/all-releases.component';
import { ComingSoonComponent } from '../shared/components/coming-soon/coming-soon.component';

export const routes: Routes = [
  {
    path: '',
    component: SideMenuComponent,
    children: [
      {
        path: '',
        redirectTo: 'news',
        pathMatch: 'full',
      },
      {
        path: 'coming-soon',
        component: ComingSoonComponent,
      },
      {
        path: 'news',
        component: GameNewsComponent,
      },
      {
        path: 'all-games',
        component: AllGamesListComponent,
      },
      {
        path: 'game-releases',
        component: GameReleasesComponent,
      },
      {
        path: 'all-releases',
        component: AllReleasesComponent,
      },
      {
        path: 'manage-games',
        component: GameManagementComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'tier-list',
            pathMatch: 'full',
          },
          {
            path: 'tier-list',
            loadComponent: () =>
              import('../pages/games/game-management/game-tier-list/game-tier-list.component').then(
                (m) => m.GameTierListComponent
              ),
          },
          {
            path: 'status-list',
            loadComponent: () =>
              import(
                '../pages/games/game-management/game-status-list/game-status-list.component'
              ).then((m) => m.GameStatusListComponent),
          },
        ],
      },
      {
        path: 'manage-games/tier-list/create-tier-list',
        component: TierListFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-games/tier-list/edit-tier-list/:tierId',
        component: TierListFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-games/tier-list/add-game-tier-list/:tierId',
        component: AddGameTierListComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];
