import { Component, QueryList, VERSION, ViewChildren } from '@angular/core';
import { BehaviorSubject, combineLatest, from, map, of, Subject } from 'rxjs';
import {
  combineLatestAll,
  debounceTime,
  mergeAll,
  mergeMap,
  scan,
  switchMap,
  take,
  tap,
  toArray,
} from 'rxjs/operators';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChildren(ProductComponent) set productQueryList(
    queryList: QueryList<ProductComponent>
  ) {
    this.productComponentList.next(queryList.toArray());
  }
  summary: number = 0;
  productComponentList = new BehaviorSubject<ProductComponent[]>([]);
  test: any;
  constructor() {
    this.productComponentList
      .pipe(
        tap((val) => console.log(val)),
        switchMap((res) => {
          if (res.length === 0) {
            return of(0);
          }
          return combineLatest(res.map((item) => item.summary$)).pipe(
            map((val) => {
              let bob = 0;
              val.forEach((item) => {
                bob += item;
              });
              return bob;
            })
          );
        }),

        debounceTime(0)
      )
      .subscribe((res) => {
        this.summary = res;
      });
  }

  name = 'Angular ' + VERSION.major;

  products: string[] = [];

  delete(index) {
    this.products.splice(index, 1);
  }
  addProduct(inputEl: HTMLInputElement) {
    this.products.push(inputEl.value);
    inputEl.value = '';
  }
}
