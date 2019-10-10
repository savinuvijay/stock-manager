import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { User } from '../user';
import { Observable } from 'rxjs';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { d } from '@angular/core/src/render3';

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
  changePasswordForm:any

  model : any={};    
  errorMessage:string;   

  constructor(private router:Router,private formbulider: FormBuilder, private loginService : LoginService) { }

  ngOnInit() {
    this.changePasswordForm = this.formbulider.group({    
      USERNAME: ['', [Validators.required]],
      PASSWORD: ['', [Validators.required]],
      NewPASSWORD: ['', [Validators.required]],
      ReEnterPassword: ['', [Validators.required]]  
    });
  }

  changePassword(data:NgForm):void{
    console.log(data.value);
    var model={
      USERNAME : data.value.USERNAME,
      PASSWORD : data.value.PASSWORD,
      NewPASSWORD : data.value.NewPASSWORD
    };
    if(data.value.NewPASSWORD == data.value.ReEnterPassword ){
      this.loginService.changePassword(model).subscribe(
        data => {
             
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
        }
      );
      jQuery('#changePasswordModal').modal("hide");
    }
    else{
      this.errorMessage = "Passwords do not match!!";
    }

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
