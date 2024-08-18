import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError
} from 'rxjs';
import {Product} from './product';
import {ProductData} from "./product-data";
import {HttpErrorService} from "../utilities/http-error.service";
import {ReviewService} from "../reviews/review.service";
import {Review} from "../reviews/review";
import {RouteConfigLoadStart} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);
  private reviewService = inject(ReviewService);
  private errorService = inject(HttpErrorService);

  private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  readonly productSelected$ = this.productSelectedSubject.asObservable();


 readonly products$  = this.http.get<Product[]>(this.productsUrl)
   .pipe(
     tap(() => console.log('In http.get pipeline')),
     tap((p) => console.log("In http.get pipeline",JSON.stringify(p))),
     shareReplay(1),
     catchError(err => this.handleError(err))
   );

  getProduct(id: number): Observable<Product> {
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl)
      .pipe(
        tap((p) => console.log('In http.get by id pipeline',p)),
        switchMap(product => this.getProductWithReviews(product)),
        tap((p) => console.log('In http.get after getProductWithReviews was called in the pipeline', p)),
        catchError(err =>
          this.handleError(err)),
      );
  }

  private getProductWithReviews(product : Product) : Observable<Product>{
    if(product.hasReviews){
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id)).pipe(
        tap(() => console.log('In getProductWithReviews pipeline')),
        map( reviews => ({...product, reviews} as Product))
      );
    } else {
      console.log("this product has no reviews !")
      return of(product);
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMassage = this.errorService.formatError(err);
    return throwError(() => formattedMassage);
  }

  productSelected(selectedProductId: number) {
    this.productSelectedSubject.next(selectedProductId);
  }
}
