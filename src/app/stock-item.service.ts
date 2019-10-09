import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { StockItem } from './stock-item';
import { catchError, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

const HttpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class StockItemService {

  private baseUrl = 'http://localhost:8085';
  private stockItemUrl = this.baseUrl + '/api/stock_item';

  constructor(private http: HttpClient) { }

  getStockItems(id : number): Observable<StockItem[]> {
    const url = `${this.stockItemUrl}/stock/${id}`;
    console.log(url);
    return this.http.get<StockItem[]>(url).pipe(
      tap(_ => console.log('fetched items')),
      catchError(this.handleError('getItems', []))
    );
  }

  addStockItems(newStock:any)
  {  
    const url = `${this.stockItemUrl}/list`;
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    console.log(newStock);
    return this.http.post(url, newStock); 
  }

  updateItemQuantity(sale_items: any){
    const url = `${this.stockItemUrl}/list/update_quantity`;
    return this.http.put(url, sale_items); 
  }

  private handleError<T>(operation = 'operation', result?: T){
    return (error : any) => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
  
}
