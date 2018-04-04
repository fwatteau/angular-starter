import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*
 * Platform and Environment providers/directives/pipes
 */
import { environment } from 'environments/environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { ViewComponent } from './view';
import { NoContentComponent } from './no-content';
import { XLargeDirective } from './home/x-large';
import { DevModuleModule } from './+dev-module';
import { AlwaysAuthGuard } from '../guard/always-auth-guard';
import { AuthProvider } from '../providers/auth/auth';
import firebase from 'firebase';

import '../styles/styles.scss';
import '../styles/headings.css';
import { OnlyLoggedInUsersGuard } from '../guard/only-logged-guard';
import { LoginComponent } from './login';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
} from '@angular/material';
import { ParentProvider } from '../providers/parent/parent';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { YagaModule } from '@yaga/leaflet-ng2';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

interface StoreType {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
}

firebase.initializeApp(FIREBASE_CONFIG);

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    ViewComponent,
    HomeComponent,
    NoContentComponent,
    XLargeDirective,
    LoginComponent,
  ],
  entryComponents: [
      ViewComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule,
    AngularFireAuthModule,
    YagaModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    }),
    /**
     * This section will import the `DevModuleModule` only in certain build types.
     * When the module is not imported it will get tree shaked.
     * This is a simple example, a big app should probably implement some logic
     */
    ...environment.showDevModule ? [ DevModuleModule ] : [],
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    environment.ENV_PROVIDERS,
    APP_PROVIDERS,
    AlwaysAuthGuard,
    OnlyLoggedInUsersGuard,
    AuthProvider,
    ParentProvider
  ]
})
export class AppModule {}
