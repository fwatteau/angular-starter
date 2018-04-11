import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Parent } from '../../model/parent';
import * as firebase from 'firebase/app';
import DocumentReference = firebase.firestore.DocumentReference;

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
  }

  public get parents(): Observable<Parent[]> {
      return this._parents;
  }

  public saveParent(parent: Parent): Promise<void> {
      parent.updateAt = new Date();
      // Persist a document id
      if (!parent.id) {

          return this.db.collection<Parent>('parents')
              .add(parent)
              .then((documentReference: DocumentReference) => {
                  parent.id = documentReference.id;
                  documentReference.set(parent);
                  console.info(parent.name + ' added !');
              });
      } else {
          return this.db
              .doc('parents/' + parent.id)
              .update(parent)
              .then(() => console.info(parent.name + ' saved !'));
      }
  }

  public deleteParent(parent: Parent) {
      return this.db
          .doc('parents/' + parent.id)
          .delete()
          .then(() => {
             console.info(parent.name + ' deleted !');
          });
  }
}
