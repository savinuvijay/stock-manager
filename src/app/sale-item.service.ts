import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { SaleItem } from './sale_item';

@Injectable({
  providedIn: 'root'
})
export class SaleItemService {

  private baseUrl = 'http://localhost:8085';
  private saleItemUrl = this.baseUrl + '/api/sale_item';

  constructor(private http: HttpClient) { }

  getSaleItems(id : number): Observable<SaleItem[]> {
    const url = `${this.saleItemUrl}/stock/${id}`;
    console.log(url);
    return this.http.get<SaleItem[]>(url).pipe(
      tap(_ => console.log('fetched items')),
      catchError(this.handleError('getItems', []))
    );
  }

  getSaleItemsBySaleId(id: number): Observable<any[]> {
    const url = `${this.baseUrl}/api/sale/sale_items/${id}`;
    console.log(url);
    return this.http.get<any[]>(url).pipe(
      tap(_ => console.log('fetched items')),
      catchError(this.handleError('getItems', []))
    );

  }

  addSaleItems(newSale:any)
  {
    const url = `${this.saleItemUrl}/list`;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    console.log(newSale);
    console.log(newSale);
    return this.http.post(url, newSale); 
  }

  private handleError<T>(operation = 'operation', result?: T){
    return (error : any) => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
