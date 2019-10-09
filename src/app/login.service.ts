import { Injectable } from '@angular/core';
import { User} from './user';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';

const HttpOptions = {
  headers: new HttpHeaders({'content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = 'http://localhost:8085';
  private loginUrl = this.baseUrl + '/login';
  token : string;  
  header : any;  
  constructor(private http: HttpClient) {   
  
    this.loginUrl = 'http://localhost:8085/api/login/';  
  
    const headerSettings: {[name: string]: string | string[]; } = {};  
    this.header = new HttpHeaders(headerSettings);  
  } 
  Login(model : any){  
    debugger;  
     var a =this.loginUrl+'UserLogin';  
   return this.http.post<any>(this.loginUrl+'userlogin',model,HttpOptions);  
  }  
  //  CreateUser(register:Register)  
  //  {  
  //   const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };  
  //   return this.http.post<Register[]>(this.Url + '/createcontact/', register, httpOptions)  
  //  } 

  // getUser(UserName: string):Observable<User>  {
  //   const url = `${this.loginUrl}/${UserName}`;
  //   const body = `{ "name": "${UserName}"}`;
  //   return this.http.get<User>(url).pipe(
  //     tap(_ => console.log(`fetched user name=${UserName}`)),
  //     catchError(this.handleError<User>(`getUser name=${UserName}`))
  //   );
  // }

  // getCourse(id: number): Observable<Course> {
  //   const url = `${this.coursesUrl}/${id}`;
  //   return this.http.get<Course>(url).pipe(
  //     tap(_ => console.log(`fetched course id=${id}`)),
  //     catchError(this.handleError<Course>(`getCourse id=${id}`))
  //   );
  // }
  // private handleError<T>(operation = 'operation', result?: T){
  //   return (error : any) => {
  //     console.error(error);
  //     console.log(`${operation} failed: ${error.message}`);
  //    return of(result as T);
  //   }
  // }
}
