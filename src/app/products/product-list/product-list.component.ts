import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import {NgIf, NgFor, NgClass, AsyncPipe} from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import {catchError, EMPTY, Subscription, tap} from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {
  pageTitle = 'Products';
  errorMessage = '';

  private productService = inject(ProductService);

  // Products
  readonly products$ = this.productService.products$
    .pipe(
      tap(() => console.log('In component pipeline')),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY; })
    );

  // Selected product id to highlight the entry
  readonly  productSelectedId$ = this.productService.productSelected$;

  onSelected(productId: number): void {
    this.productService.productSelected(productId);
  }
}
