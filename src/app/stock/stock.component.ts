import { Component, OnInit } from '@angular/core';
import { Stock } from '../stock';
import { Router } from '@angular/router';
import { StockService } from '../stock.service';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { st } from '@angular/core/src/render3';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  stocks : Stock[]
  errorMessage : string

  data = false;    
  ItemForm: any;    
  message:string;

  currentDate:Date;

  AddStockForm : any;
  constructor(private router:Router,private formbulider: FormBuilder,private stockService : StockService) { }

  ngOnInit() {
    this.GetStock();
    this.AddStockForm = this.formbulider.group({    
      STOCK_NAME: ['', [Validators.required]],
      PURCHASE_DATE: ['', [Validators.required]],
      ENTRY_DATE: ['', [Validators.required]],  
    }); 
    this.currentDate = new Date();
    console.log(this.currentDate.getFullYear()+"/"+this.currentDate.getMonth()+"/"+this.currentDate.getDate());
  }

  GetStock(): void{
    this.stockService.getStock().subscribe(stocks => this.stocks=stocks);
  }
  AddStock(stock:Stock)    
  { 
    console.log("function called");   
  this.stockService.AddStock(stock).subscribe(    
    ()=>    
    {    
      this.data = true;    
      this.message = 'Data saved Successfully';    
      //this.ItemForm.reset();
      this.router.navigate(['/dashboard']);    
    });    
  }

  nextAddItems(stock:Stock){
    stock.ENTRY_DATE = this.currentDate;
    console.log("inside stock item")
    this.stockService.saveStock(stock);
    jQuery('#addStockModal').modal("hide");
    this.router.navigate(['/stockitem/0']);
  }

  ViewStockItem(id : number):void{
    this.router.navigate(['/stockitem/'+id]); 
  }
  Goback():void{
    this.router.navigate(['/dashboard']);
  }
}
