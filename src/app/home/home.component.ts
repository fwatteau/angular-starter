import { Component, OnInit } from '@angular/core';
import { icon, Icon, latLng, LatLng } from 'leaflet';
import { Title } from './title';
import { Parent, ParentMarker, ParentProvider } from '../../providers/parent/parent';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ViewComponent } from '../view';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'home',  // <home></home>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [
    Title
  ],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: [ './home.component.css' ],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public tileLayerUrl: string = OSM_TILE_LAYER_URL;
  public center: LatLng = latLng(50.6570387, 3.135499);

  public layers: ParentMarker[] = [
      // marker([ 50.6570387, 3.135499 ])
  ];
  protected recentIcon: Icon = icon({
    iconUrl: '../../assets/icon/marker-icon.png',
    iconSize: [25, 41],
    shadowUrl: '../../assets/icon/marker-shadow.png',
    shadowSize: [41, 41],
    iconAnchor: [12, 40],
    shadowAnchor: [12, 41],
    popupAnchor: [0, -30]
  });

  protected oldIcon: Icon = icon({
    iconUrl: '../../assets/icon/marker-icon-2x.png',
    iconSize: [50, 82],
    shadowUrl: '../../assets/icon/marker-shadow.png',
    shadowSize: [82, 82],
    iconAnchor: [25, 82],
    shadowAnchor: [25, 82],
    popupAnchor: [0, -55]
  });

  protected homeIcon: Icon = icon({
      iconUrl: '../../assets/icon/maison-icon.png',
      iconSize: [41, 41],
      shadowUrl: '../../assets/icon/marker-shadow.png',
      shadowSize: [41, 41],
      iconAnchor: [20, 40],
      shadowAnchor: [20, 41],
      popupAnchor: [1, -30]
  });
  protected parents: Observable<Parent[]>;
  protected dialogConfig: MatDialogConfig = new MatDialogConfig();
  /**
   * TypeScript public modifiers
   */
  constructor(
    public title: Title,
    public http: HttpClient,
    public dialog: MatDialog,
    public parentProvider: ParentProvider) {
    this.parents = parentProvider.parents;
  }

  public openDialog(parent: Parent) {
    console.log(this.dialogConfig.data);
    this.dialogConfig.data = {parent};
    this.dialog.open(ViewComponent, this.dialogConfig);
  }

  public ngOnInit() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '80vw';

    this.parents.subscribe((parents) => {
      parents.forEach((parent: Parent) => {
          if (!parent.geom || !parent.geom.lat) {
              this.http.get('https://api-adresse.data.gouv.fr/search/?q=' + parent.address)
                  .subscribe( (res) => {
                      if (!res ||
                          !res['features'] ||
                          !res['features'].length ) {
                          return;
                      }

                      parent.geom = latLng((res as any).features[0].geometry.coordinates[1]
                          , (res as any).features[0].geometry.coordinates[0]);

                      this.layers.push({parent, icon: this.recentIcon});
                  });
          } else {
              this.layers.push({parent, icon: this.homeIcon});
          }
      });
    });
  }
}
