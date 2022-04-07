import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  shareReplay,
  startWith,
  Subject,
  tap,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  @Input() productName: string;
  destroy$ = new Subject<void>();
  priceForm = new FormControl(0);
  vatForm = new FormControl(7);
  amountForm = new FormControl(1);

  price$ = this.priceForm.valueChanges.pipe(startWith(this.priceForm.value));
  vat$ = this.vatForm.valueChanges.pipe(startWith(this.vatForm.value));
  amount$ = this.amountForm.valueChanges.pipe(startWith(this.amountForm.value));

  private summaryState = new BehaviorSubject<number>(0);
  summary$ = this.summaryState.asObservable();
  @Output() deleteAction = new EventEmitter<void>();
  // createForm -> patchValue ngOnInit -> AfterViewInit โดน subscribe ด้วย pipe async

  constructor() {
    combineLatest({
      price: this.price$,
      vat: this.vat$,
      amount: this.amount$,
    })
      .pipe(
        map(({ price, vat, amount }) => {
          // console.count('summary');
          return (price * amount * (vat + 100)) / 100;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(this.summaryState);
    // .subscribe({
    //   next: (value) => this.summaryState.next(value),
    //   error: (err) => this.summaryState.error(err),
    //   complete: () => this.summaryState.complete(),
    // });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  delete() {
    this.deleteAction.emit();
  }

  ngOnInit() {}
}
