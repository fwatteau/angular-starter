import { Component, OnInit } from '@angular/core';
import { icon, Icon, latLng, LatLng } from 'leaflet';
import { Title } from './title';
import { ParentProvider } from '../../providers/parent/parent';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ViewComponent } from '../view';
import { AuthProvider, User } from '../../providers/auth/auth';
import { ActivatedRoute } from '@angular/router';
import { Parent, ParentMarker } from '../../model/parent';

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
  public tileLayerUrl: string = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  public center: LatLng = latLng(50.6570387, 3.135499);
  public user: User;
  public legends: Icon[] = [];
  public newUser: string;

  public layers: ParentMarker[] = [];
  protected recentIcon: Icon = icon({
    iconUrl: '../../assets/icon/marker-green-icon.png',
    iconSize: [25, 41],
    shadowUrl: '../../assets/icon/marker-shadow.png',
    shadowSize: [41, 41],
    iconAnchor: [12, 40],
    shadowAnchor: [12, 41],
    attribution: 'Mis à jour récemment',
    popupAnchor: [0, -30]
  });

  protected oldIcon: Icon = icon({
    iconUrl: '../../assets/icon/marker-red-icon.png',
    iconSize: [25, 41],
    shadowUrl: '../../assets/icon/marker-shadow.png',
    shadowSize: [41, 41],
    iconAnchor: [12, 40],
    shadowAnchor: [12, 41],
    attribution: 'Mis à jour l\'an dernier',
    popupAnchor: [0, -30]
  });

  protected bugIcon: Icon = icon({
    iconUrl: '../../assets/icon/marker-icon-2x.png',
    iconSize: [50, 82],
    shadowUrl: '../../assets/icon/marker-shadow.png',
    shadowSize: [82, 82],
    iconAnchor: [25, 82],
    shadowAnchor: [25, 82],
    attribution: 'Un bug',
    popupAnchor: [0, -55]
  });

  protected homeIcon: Icon = icon({
    iconUrl: '../../assets/icon/maison-icon.png',
    iconSize: [51, 51],
    shadowUrl: '../../assets/icon/marker-shadow.png',
    shadowSize: [41, 41],
    iconAnchor: [25, 51],
    shadowAnchor: [25, 51],
    attribution: 'Votre maison',
    popupAnchor: [1, -30]
  });

  protected schoolIcon: Icon = icon({
    iconUrl: '../../assets/icon/marker-school-icon.png',
    iconSize: [42, 51],
    shadowUrl: '../../assets/icon/marker-shadow.png',
    shadowSize: [41, 41],
    iconAnchor: [21, 50],
    shadowAnchor: [10, 41],
    attribution: 'Le Collège',
    popupAnchor: [0, -20],
    tooltipAnchor: [0, -20]
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
    public parentProvider: ParentProvider,
    public auth: AuthProvider,
    private route: ActivatedRoute) {
    this.parents = parentProvider.parents;
  }

  public ngOnInit() {
    this.route.queryParamMap
      .subscribe((params) => {
          this.newUser = params.get('newUser');
      });
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '80vw';
    const ya6mois = new Date();
    ya6mois.setMonth(ya6mois.getMonth() - 6);

    this.legends = [this.recentIcon, this.oldIcon, this.schoolIcon, this.homeIcon];

    this.auth.user$.subscribe((user: User) => {
        this.user = user;
        this.parents.subscribe((parents) => {
            parents.forEach((parent: Parent) => {
                let parentIcon: Icon;
                if (this.isCollege(parent)) {
                    parentIcon = this.schoolIcon;
                } else if (this.isMyHome(parent)) {
                    parentIcon = this.homeIcon;
                } else if (parent.updateAt > ya6mois) {
                    parentIcon = this.recentIcon;
                } else {
                    parentIcon = this.oldIcon;
                }

                if (!parent.geom || !parent.geom.lat) {
                    // Ne doit jamais entrer dans cette zone ... normalement
                    this.http.get('https://api-adresse.data.gouv.fr/search/?q=' + parent.address)
                        .subscribe( (res) => {
                            if (!res ||
                                !res['features'] ||
                                !res['features'].length ) {
                                return;
                            }

                            parent.geom = latLng((res as any).features[0].geometry.coordinates[1]
                                , (res as any).features[0].geometry.coordinates[0]);

                            this.layers.push({parent, icon: this.bugIcon});
                        });
                } else {
                    this.layers.push({parent, icon: parentIcon});
                }

                // First connexion
                if (this.newUser && parent.mail.toUpperCase() === this.newUser.toUpperCase()) {
                    this.newUser = '';
                    this.openDialog(parent);
                }
            });

            // First connexion + New user
            if (this.newUser) {
                const parent = new Parent();
                parent.mail = this.newUser;
                this.newUser = '';
                this.openDialog(parent);
            }
        });
    });
  }

  public openMyHome(parent: Parent) {
    if (this.isMyHome(parent)) {
        this.openDialog(parent);
    }
  }

  public openDialog(parent: Parent) {
    if (this.canEdit(parent)) {
        this.dialogConfig.data = {parent};
        this.dialog.open(ViewComponent, this.dialogConfig);
    }
  }

  public isCollege(parent: Parent): boolean {
    return parent.id === '0';
  }

  public isMyHome(parent: Parent): boolean {
    return parent.mail.toUpperCase() === this.user.email.toUpperCase();
  }

  public canEdit(parent: Parent): boolean {
      return this.auth.isAdmin(this.user)
        || this.isMyHome(parent);
  }
}
