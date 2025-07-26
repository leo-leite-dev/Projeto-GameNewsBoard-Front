import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GameReleaseService } from '../game-release.service';
import { PlatformFamily } from '../../enums/platform.enum';
import { GameReleaseResponse } from '../../models/game-release.model';

@Injectable({ providedIn: 'root' })
export class GameReleaseLoaderService {
    constructor(private service: GameReleaseService) { }

    loadAllByCategory(
        category: 'upcoming' | 'today' | 'recent',
        platform: PlatformFamily,
        limit = 14
    ): Observable<GameReleaseResponse[]> {
        let source$: Observable<any>;

        switch (category) {
            case 'recent':
                source$ = this.service.getRecentGames(limit, platform);
                break;
            case 'today':
                source$ = this.service.getTodayGames(platform);
                break;
            default:
                source$ = this.service.getUpcomingGames(limit, platform);
                break;
        }

        return source$.pipe(
            map(res => res.data ?? []),
            catchError(() => of([]))
        );
    }

    loadAllGrouped(platform: PlatformFamily, limit = 7): Observable<{
        today: GameReleaseResponse[];
        upcoming: GameReleaseResponse[];
        recent: GameReleaseResponse[];
    }> {
        return forkJoin({
            today: this.service.getTodayGames(platform).pipe(
                map(res => res.data ?? []),
                catchError(() => of([]))
            ),
            upcoming: this.service.getUpcomingGames(limit, platform).pipe(
                map(res => res.data ?? []),
                catchError(() => of([]))
            ),
            recent: this.service.getRecentGames(limit, platform).pipe(
                map(res => res.data ?? []),
                catchError(() => of([]))
            ),
        });
    }

}
