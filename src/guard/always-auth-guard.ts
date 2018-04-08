import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AlwaysAuthGuard implements CanActivate {
    public canActivate() {
        return true;
    }
}
