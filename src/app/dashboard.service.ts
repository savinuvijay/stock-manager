import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Item} from './item';
import { NewItem} from './newitem';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

const HttpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:8085';
  private dashboardUrl = this.baseUrl + '/api/items';
  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.dashboardUrl).pipe(
      tap(_ => console.log('fetched items')),
      catchError(this.handleError('getItems', []))
    );
  }

  // AddItem(itemModel : any){  
  //   debugger;  
  //    //var a =this.dashboardUrl+'UserLogin';
  //    const body = `{ "NAME": "${itemModel.NAME}"}`;  
  //    console.log("inside service")
  //  return this.http.post<any>(this.dashboardUrl,itemModel,HttpOptions);  
  // }  
  AddItem(newitem:NewItem)  
   {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    console.log(newitem);  
    return this.http.post<NewItem[]>(this.dashboardUrl , newitem, httpOptions)  
   }  

  private handleError<T>(operation = 'operation', result?: T){
    return (error : any) => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
