import { DevModuleComponent } from './dev-module.component';
import { AlwaysAuthGuard } from '../../guard/always-auth-guard';
import { OnlyLoggedInUsersGuard } from '../../guard/only-logged-guard';

export const routes = [
  { path: 'dev-module'
      , component: DevModuleComponent
      , canActivate: [OnlyLoggedInUsersGuard, AlwaysAuthGuard],
  }
];
