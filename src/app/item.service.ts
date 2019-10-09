import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Item } from './item';
import { tap, catchError } from 'rxjs/operators';
import { NewItem } from './newitem';

const HttpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private baseUrl = 'http://localhost:8085';
  private itemUrl = this.baseUrl + '/api/items';
  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.itemUrl).pipe(
      tap(_ => console.log('fetched items')),
      catchError(this.handleError('getItems', []))
    );
  }

  AddItem(newitem:NewItem)  
  {  
   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
   console.log(newitem);  
   return this.http.post<NewItem[]>(this.itemUrl , newitem, httpOptions)  
  }

  deleteItem(id: number): Observable<any>{
    const url = `${this.itemUrl}/${id}`;
    return this.http.delete(url, HttpOptions).pipe(
      tap(_ => console.log(`deleted console id=${id}`)),
      catchError(this.handleError<Console>('deleteConsole'))
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
