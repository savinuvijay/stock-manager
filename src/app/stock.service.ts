import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Stock } from './stock';

const HttpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8085';
  private stockUrl = this.baseUrl + '/api/stock';

  newStock : Stock;

  AddStock(newStock:Stock)  
  {  
   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
   console.log(newStock);  
   return this.http.post<Stock[]>(this.stockUrl , newStock, httpOptions)  
  }

  saveStock(newStock:Stock){
    this.newStock = newStock;
  }
  getSavedStock() : Stock{
    return this.newStock;
  }

  getStock(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.stockUrl).pipe(
      tap(_ => console.log('fetched items')),
      catchError(this.handleError('getStock', []))
    );
  }
  getLastStock(): Observable<any> {
    const url = `${this.stockUrl}/last/item`;
    return this.http.get<any>(url).pipe(
      tap(_ => console.log(`fetched last course`)),
      catchError(this.handleError<any>(`getCourse`))
    );
  }
private handleError<T>(operation = 'operation', result?: T){
  return (error : any) => {
    console.error(error);
    console.log(`${operation} failed: ${error.message}`);
    return of(result as T);
  }
}

}