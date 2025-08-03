import { Routes } from '@angular/router';
import { GameNewsComponent } from '../pages/game-news/game-news.component';
import { GameManagementComponent } from '../pages/games/game-management/game-management.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AddGameTierListComponent } from '../pages/games/game-management/game-tier-list/add-game-tier-list/add-game-tier-list.component';
import { GameReleasesComponent } from '../pages/game-releases/game-releases.component';
import { AllReleasesComponent } from '../pages/game-releases/all-releases/all-releases.component';
import { ComingSoonComponent } from '../shared/components/coming-soon/coming-soon.component';
import { AddTierListComponent } from '../pages/games/game-management/game-tier-list/add-tier-list/add-tier-list.component';
import { SideMenuComponent } from '../shared/components/nav/side-menu/side-menu.component';

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
        component: ComingSoonComponent,
      },
      {
        path: 'all-games',
        component: ComingSoonComponent,
      },
      {
        path: 'game-releases',
        component: ComingSoonComponent,
      },
      {
        path: 'all-releases',
        component: ComingSoonComponent,
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
        component: AddTierListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-games/tier-list/edit-tier-list/:tierId',
        component: AddTierListComponent,
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
