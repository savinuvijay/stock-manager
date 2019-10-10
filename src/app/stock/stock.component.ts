import { Component, OnInit } from '@angular/core';
import { Stock } from '../stock';
import { Router } from '@angular/router';
import { StockService } from '../stock.service';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { st } from '@angular/core/src/render3';
import { StockItemService } from '../stock-item.service';
import { StockItem } from '../stock-item';
import { forEach } from '@angular/router/src/utils/collection';

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

  stock_items : StockItem[];

  stock_items_profit : any[];

  totalProfit :number;

  currentStockName: string;

  currentDate:Date;
  profitFlag:number;
  totalProfitFlag:number;
  AddStockForm : any;
  constructor(
    private router:Router,
    private formbulider: FormBuilder,
    private stockService : StockService,
    private stockItmeService : StockItemService
    ) { }

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

  getStockDetails(id : number, stock_name: string):void{
    this.currentStockName = stock_name;
    this.getStockItems(id);
    console.log(this.stock_items_profit);
  }

  getStockItems(id : number): void{
    this.stockItmeService.getStockItems(id).subscribe( stock_items => {
      this.stock_items = stock_items;
      this.stock_items_profit = [];
      this.totalProfit = 0;
    this.stock_items.forEach(item => {
      var profit = (item.SELLING_PRICE - item.COST_PRICE)*(item.INITIAL_QUANTITY - item.QUANTITY);
      //var profitPercent = Math.round((item.SELLING_PRICE - item.COST_PRICE) * 100 / item.COST_PRICE );
      if(profit > 0){
        this.profitFlag = 1;
      }
      else if (profit < 0){
        this.profitFlag = 2;
      }
      else {
        this.profitFlag = 3;
      }
      var item_with_profit = {
        ITEM_ID: item.ITEM_ID,
        STOCK_ITEM_ID: item.STOCK_ITEM_ID,
        ITEM_NAME: item.ITEM_NAME,
        INITIAL_QUANTITY: item.INITIAL_QUANTITY,
        QUANTITY: item.QUANTITY,
        COST_PRICE: item.COST_PRICE,
        SELLING_PRICE: item.SELLING_PRICE,
        PROFIT : profit
      }
      this.stock_items_profit.push(item_with_profit);
      this.totalProfit += profit;
    });
    if(this.totalProfit > 0){
      this.totalProfitFlag = 1;
    }
    else if (this.totalProfit < 0){
      this.totalProfitFlag = 2;
    }
    else {
      this.totalProfitFlag = 3;
    }
    } );
    console.log("stock items");
    console.log(this.stock_items);
  }

  Goback():void{
    this.router.navigate(['/dashboard']);
  }
}
