import { Component, OnInit } from '@angular/core';
import { AdditemService } from '../additem.service';
import { Item } from '../item';
import { NewItem } from '../newitem';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'; 


@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent implements OnInit {

  itemModel : any = {}
  items : Item[]
  errorMessage : string

  data = false;    
  ItemForm: any;    
  message:string;
  constructor(private router:Router,private formbulider: FormBuilder,private addItemService : AdditemService) { }

  ngOnInit() {
     this.ItemForm = this.formbulider.group({    
      NAME: ['', [Validators.required]],  
    }); 
  }

  onFormSubmit()    
  {    
    const item = this.ItemForm.value;    
   // this.CreateItem(item);    
  }    
  AddItem(item:NewItem)    
  { 
    console.log("function called");   
  this.addItemService.AddItem(item).subscribe(    
    ()=>    
    {    
      this.data = true;    
      this.message = 'Data saved Successfully';    
      //this.ItemForm.reset();
      this.router.navigate(['/dashboard']);    
    });    
  }    




  // AddThisItem(){    
  //   debugger;    
  //   console.log("Adding "); 
  //   console.log("Item Model is "); 
  //   console.log(this.itemModel); 
  //   console.log(this.itemModel.NAME); 
  //   this.dashboardService.AddItem(this.itemModel).subscribe(    
  //     data => {
  //       console.log(data);    
  //       console.log("subscribed");
  //       // debugger;    
  //       // if(data.status=="success")    
  //       // {       
  //       //  console.log("SuccesFully Added")  
  //       // }    
  //       // else{    
  //       //   this.errorMessage = "Wrong Password!!";    
  //       // }    
  //     },    
  //     error => {    
  //       this.errorMessage = error.message;    
  //     });    
  // }; 





  // addThisItem(ItemName : string):void{
  //   ItemName = ItemName.trim();
  //   if(!ItemName){return;}
  //   this.AddItemService.AddItem(ItemName).subscribe(item => {
  //     this.items.push(item);}
  //   );
  // }
}

