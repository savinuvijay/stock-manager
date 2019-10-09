import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { User } from '../user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //user : Observable<User>
  users : User[];
  // GivenId : string
  // GivenPassword : string
  IsMatch : boolean

  model : any={};    
  errorMessage:string;   

  constructor(private router:Router, private loginService : LoginService) { }

  ngOnInit() {
  
  }

  // getUser(GivenId : string, GivenPassword: string):void{
  // this.loginService.getUser(GivenId).subscribe(
  //   user => {
  //     this.users.push(user);
  //   }
  // );
  // this.IsMatch = this.users[0].password == GivenPassword;
  // }

  login(){    
    debugger;    
    console.log("Login"); 
    this.loginService.Login(this.model).subscribe(    
      data => {
        console.log(data);    
        debugger;    
        if(data.status=="success")    
        {       
          this.router.navigate(['/dashboard']);    
          debugger;    
        }    
        else{    
          this.errorMessage = "Wrong Password!!";    
        }    
      },    
      error => {    
        this.errorMessage = error.message;    
      });    
  };    


}
