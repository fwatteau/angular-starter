import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthProvider } from '../providers/auth/auth';

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {
    constructor(private userService: AuthProvider, private router: Router) {}

    public canActivate() {
        if (this.userService.isLoggedIn()) {
            return true;
        } else {
            console.warn("You don't have permission to view this page");
            this.router.navigateByUrl('/login');
            return false;
        }
    }
}
