import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Icon, LatLng } from 'leaflet';
import firebase from 'firebase/app';

export interface ParentMarker {
    parent: Parent;
    icon: Icon;
}

export interface Parent {
    id: string;
    name: string;
    address: string;
    capacities: string;
    needs: string;
    mail: string;
    phone: string;
    children: string;
    classroom: string;
    geom: LatLng;
}
/*
  Generated class for the ParentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ParentProvider {
  private _parents: Observable<Parent[]>;

  constructor(public db: AngularFirestore) {
      this._parents = db.collection<Parent>('parents')
          .valueChanges();
     /*firebase.firestore().enablePersistence()
          .then(function() {
              // Initialize Cloud Firestore through firebase
              this.db = firebase.firestore();
              this._items = db.collection("parents").valueChanges();
          })
          .catch(function(err) {
              if (err.code == 'failed-precondition') {
                  // Multiple tabs open, persistence can only be enabled
                  // in one tab at a a time.
                  // ...
              } else if (err.code == 'unimplemented') {
                  // The current browser does not support all of the
                  // features required to enable persistence
                  // ...
              }
          });*/
  }

  private get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  public get parents(): Observable<Parent[]> {
      return this._parents;
  }

  public saveParent(parent: Parent) {
      // Persist a document id
      if (!parent.id) {
          parent.id = this.db.createId();
          this.db.collection<Parent>('parents')
              .add(parent)
              .then(() => console.log('parent.name added !'));
      } else {
          this.db
              .doc('parents/' + parent.id)
              .update(parent)
              .then(() => console.log('parent.name saved !'));
      }
  }

}
