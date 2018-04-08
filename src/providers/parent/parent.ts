import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { Parent } from '../../model/parent';
import FieldValue = firebase.firestore.FieldValue;

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
      parent.updateAt = FieldValue.serverTimestamp();
      // Persist a document id
      if (!parent.id) {
          parent.id = this.db.createId();
          return this.db.collection<Parent>('parents')
              .add(parent)
              .then(() => console.info(parent.name + ' added !'));
      } else {
          return this.db
              .doc('parents/' + parent.id)
              .update(parent)
              .then(() => console.info(parent.name + ' saved !'));
      }
  }

}
