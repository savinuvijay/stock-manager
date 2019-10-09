import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sale } from './sale';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:8085';
  private stockUrl = this.baseUrl + '/api/sale';

  newSale : Sale;

  AddSale(newStock:any)  
  {  
   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
   console.log(newStock);  
   return this.http.post(this.stockUrl , newStock, httpOptions)  
  }

  getSale(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.stockUrl).pipe(
      tap(_ => console.log('fetched items')),
      catchError(this.handleError('getStock', []))
    );
  }

  getLastSale(): Observable<Sale> {
    const url = `${this.stockUrl}/last/item`;
    return this.http.get<Sale>(url).pipe(
      tap(_ => console.log(`fetched last course`)),
      catchError(this.handleError<Sale>(`getCourse`))
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
