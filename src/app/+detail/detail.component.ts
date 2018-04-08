import { Component, OnInit, } from '@angular/core';
import { Parent } from '../../model/parent';

/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Detail` component loaded asynchronously');

@Component({
  selector: 'detail',
  template: `
    <h1>Hello from Detail {{parent.name}}</h1>
    <span>
      <a [routerLink]=" ['./child-detail'] ">
        Child Detail
      </a>
    </span>
    <router-outlet></router-outlet>
  `,
})
export class DetailComponent implements OnInit {
  public parent: Parent;

  public ngOnInit() {
    console.log('hello `Detail` component');
  }

}
