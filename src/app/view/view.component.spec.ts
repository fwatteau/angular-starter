import { ActivatedRoute, Data } from '@angular/router';
import { inject, TestBed } from '@angular/core/testing';
/**
 * Load the implementations that should be tested.
 */
import { ViewComponent } from './view.component';

describe('About', () => {
  /**
   * Provide our implementations or mocks to the dependency injector
   */
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      /**
       * Provide a better mock.
       */
      {
        provide: ActivatedRoute,
        useValue: {
          data: {
            subscribe: (fn: (value: Data) => void) => fn({
              yourData: 'yolo'
            })
          }
        }
      },
      ViewComponent
    ]
  }));

  it('should log ngOnInit', inject([ViewComponent], (about: ViewComponent) => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    about.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));

});
