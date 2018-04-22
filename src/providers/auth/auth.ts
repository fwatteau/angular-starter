import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class AuthProvider {
    public user$: Observable<User>;

    constructor(private afAuth: AngularFireAuth,
                private afs: AngularFirestore) {
        //// Get auth data, then get firestore user document || null
        this.user$ = this.afAuth.authState
            .switchMap((user) => {
                if (user) {
                    return this.afs.doc<User>(`userProfile/${user.uid}`).valueChanges();
                } else {
                    return Observable.of(null);
                }
            });
    }

    public loginUser(email: string, password: string): Promise<any> {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .catch((error: string) => console.error(error));
    }

    public signupUser(email: string, password: string): Promise<any> {
        return this.afAuth.auth
            .createUserWithEmailAndPassword(email, password)
            .then( (newUser) => {
                this.updateUserData(newUser);
            });
    }

    public getUsers(): Observable<User[]> {
        const userRef = this.afs
            .collection<User>('userProfile')
            .valueChanges();

        return userRef;
    }

    public resetPassword(email: string): Promise<void> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    public logoutUser(): Promise<void> {
        return this.afAuth.auth.signOut();
    }

    public isLoggedIn(): boolean {
        return this.afAuth.auth.currentUser != null;
    }

    public isParent(user: User): boolean {
        const allowed = ['admin', 'parent'];
        return this.checkAuthorization(user, allowed);
    }

    public isAdmin(user: User): boolean {
        const allowed = ['admin'];
        return this.checkAuthorization(user, allowed);
    }

    // determines if user has matching role
    private checkAuthorization(user: User, allowedRoles: string[]): boolean {
        if (!user) {
            return false;
        }

        for (const role of allowedRoles) {
            if ( user.roles[role] ) {
                return true;
            }
        }
        return false;
    }

    private updateUserData(user) {
        // Sets user data to firestore on login
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`userProfile/${user.uid}`);
        const data: User = {
            uid: user.uid,
            email: user.email,
            roles: {
                parent: true
            }
        };
        return userRef.set(data, { merge: true });
    }
}

export interface Roles {
    parent?: boolean;
    admin?: boolean;
}

export interface User {
    uid: string;
    email: string;
    roles: Roles;
}
