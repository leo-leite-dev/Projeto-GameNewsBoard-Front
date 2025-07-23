import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalAuthService {
    private modalViewSubject = new BehaviorSubject<'login' | 'register' | null>(null);
    modalView$ = this.modalViewSubject.asObservable();

    private showLogoutSubject = new BehaviorSubject<boolean>(false);
    showLogoutModal$ = this.showLogoutSubject.asObservable();

    private pendingRedirect: string | null = null;

    setModal(view: 'login' | 'register' | null) {
        this.modalViewSubject.next(view);
    }

    openLogin() {
        this.setModal('login');
    }

    openRegister() {
        this.setModal('register');
    }

    closeModal() {
        this.setModal(null);
    }

    openLogout() {
        this.showLogoutSubject.next(true);
    }

    closeLogout() {
        this.showLogoutSubject.next(false);
    }

    setPendingNavigation(path: string) {
        this.pendingRedirect = path;
    }

    getPendingNavigation(): string | null {
        return this.pendingRedirect;
    }

    clearPendingNavigation() {
        this.pendingRedirect = null;
    }
}