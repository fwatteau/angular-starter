import { Icon, latLng, LatLng } from 'leaflet';
import { Injectable } from '@angular/core';
import FieldValue = firebase.firestore.FieldValue;


export interface ParentMarker {
    parent: Parent;
    icon: Icon;
}

@Injectable()
export class Parent {
    public id: string = '';
    public name: string = '';
    public address: string = '';
    public capacities: string = '';
    public needs: string = '';
    public mail: string = '';
    public phone: string = '';
    public children: string = '';
    public classroom: string = '';
    public geom: LatLng = latLng([0,0]);
    public updateAt: FieldValue = FieldValue.serverTimestamp();
}