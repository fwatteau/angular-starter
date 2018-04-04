import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthProvider {
    public loginUser(email: string, password: string): Promise<any> {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    public signupUser(email: string, password: string): Promise<any> {
        return firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then( (newUser) => {
                firebase
                    .firestore()
                    .collection('/userProfile')
                    .add({ uid: newUser.uid, email });
            });
    }

    public resetPassword(email: string): Promise<void> {
        return firebase.auth().sendPasswordResetEmail(email);
    }

    public logoutUser(): Promise<void> {
        return firebase.auth().signOut();
    }

    public isLoggedIn(): boolean {
        return firebase.auth().currentUser != null;
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
