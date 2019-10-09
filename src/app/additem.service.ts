import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from './item';
import { NewItem } from './newitem';

const HttpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AdditemService {

  private baseUrl = 'http://localhost:8085';
  private itemUrl = this.baseUrl + '/api/items';

  constructor(private http: HttpClient) { }

  // AddItem(itemModel : any){  
  //   debugger;  
  //    const body = `{ "NAME": "${itemModel.NAME}"}`;  
  //    console.log("inside service")
  //    console.log(itemModel.NAME)
  //  return this.http.post<any>(this.itemUrl,itemModel,HttpOptions);  
  // }  

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

    updateCourse(item: Item): Observable<any>{
    const url = `${this.itemUrl}/${item.ID}`;
    return this.http.put(url,item,HttpOptions).pipe(
      tap(_ => console.log(`updated course id=${item.ID}`)),
      catchError(this.handleError<any>('updateCourse'))
    );
  }



  // AddItem(itemName : string): Observable<any>{    
  //   const body = `{ "name": "${itemName}"}`;
  //   return this.http.post(this.itemUrl,body,HttpOptions).pipe(
  //     tap((newItem: Item) => console.log(`added item w/ id=${newItem.ID}`)),
  //     catchError(this.handleError<Item>('addCourse'))
  //   );
  // }

  private handleError<T>(operation = 'operation', result?: T){
    return (error : any) => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
}
}
