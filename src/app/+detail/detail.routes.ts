import { DetailComponent } from './detail.component';

export const routes = [
  { path: '', children: [
    { path: 'test', component: DetailComponent },
    { path: 'child-detail', loadChildren: './+child-detail#ChildDetailModule' }
  ]},
];
