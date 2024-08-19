import {Component, inject} from '@angular/core';

import {NgIf, NgFor, CurrencyPipe, AsyncPipe} from '@angular/common';
import {Product} from '../product';
import {catchError, EMPTY, Subscription, tap} from 'rxjs';
import {ProductService} from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent {
  errorMessage = '';
  sub!: Subscription;

  private productService = inject(ProductService);

  // Product to display
  readonly product$ = this.productService.product$.pipe(
    catchError(err => {
      this.errorMessage = err;
        return EMPTY;
    })
  );

  // Set the page title
  pageTitle = 'Product Detail';

  addToCart(product: Product) {
  }
}
