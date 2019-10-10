import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockItemService } from "../stock-item.service";
import { StockItem } from '../stock-item';
import { DashboardService } from '../dashboard.service';
import { StockService } from "../stock.service";
import { Router } from '@angular/router';
import { Item } from '../item';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'; 
import { Stock } from '../stock';
import { st } from '@angular/core/src/render3';


@Component({
  selector: 'app-stock-item',
  templateUrl: './stock-item.component.html',
  styleUrls: ['./stock-item.component.css']
})
export class StockItemComponent implements OnInit {
  stock : Stock;
  lastStock : any;
  constructor(
    private route : ActivatedRoute,
    private stockItmeService : StockItemService,
    private dashboardService : DashboardService,
    private stockService : StockService,
    private formbulider: FormBuilder,
    private router : Router
    ) {
      //console.log(this.stockService.getSavedStock());
      this.stock = this.stockService.getSavedStock();
     }
  stock_id : number;
  stock_items : StockItem[] = [];
  allItems : Item[];
  ItemForm: any; 
  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.stock_id = id;
    if(id != 0){
      this.getStockItems(this.stock_id);
    }
    this.ItemForm = this.formbulider.group({    
      ITEM_ID: ['', [Validators.required]], 
      QUANTITY: ['', [Validators.required]], 
      COST_PRICE: ['', [Validators.required]], 
      SELLING_PRICE: ['', [Validators.required]], 
    }); 
    //this.fetchAllItems();
  }
  getStockItems(id : number): void{
    this.stockItmeService.getStockItems(id).subscribe( stock_items => this.stock_items = stock_items );
    console.log("stock items");
    console.log(this.stock_items);
  }
  fetchAllItems() : void {
    this.dashboardService.getItems().subscribe( allItems => this.allItems = allItems );
  }

  addStockItem(data, form: NgForm) : void {
    var stock_item : StockItem = {
      STOCK_ITEM_ID: 0,
      STOCK_ID: 0,
      ITEM_ID: 0,
      ITEM_NAME: "",
      INITIAL_QUANTITY: 0,
      QUANTITY: 0,
      COST_PRICE: 0.0,
      SELLING_PRICE: 0.0
    };
    console.log("Stock Item Submit");
    console.log(data);
    console.log(stock_item);
    console.log(data.ITEM_ID);
    var splitted = data.ITEM_ID.split(" ", 2); 
    stock_item.ITEM_ID = splitted[0];
    stock_item.ITEM_NAME = splitted[1];
    stock_item.INITIAL_QUANTITY = data.QUANTITY;
    stock_item.QUANTITY = data.QUANTITY;
    stock_item.COST_PRICE = data.COST_PRICE;
    stock_item.SELLING_PRICE = data.SELLING_PRICE;
    console.log(stock_item);
    this.stock_items.push(stock_item);
    jQuery('#addItemModal').modal("hide");
    form.reset();
  }
  addStock() : void {
    console.log(this.stock);
    this.stockService.AddStock(this.stock).subscribe(    
      ()=>    
      {    
        this.stockService.getLastStock().subscribe(
          lastStock => {
            this.lastStock = lastStock;
            console.log("New Stock : ");
            console.log(this.lastStock);
            console.log(this.stock_items);
            this.addStockItems(this.stock_items, this.lastStock.STOCK_ID);
          }
        );
        this.router.navigate(['/stock']); 
      });    
  }
  addStockItems(stock_item_list: StockItem[], lastStockId : number): void{
    if (!stock_item_list) { return; }
    var stock_items_list = {
      stock_items : stock_item_list,
      stock_id : lastStockId
    }
    this.stockItmeService.addStockItems(stock_items_list).subscribe(
    //   course => {
    //     this.courses.push(course);
    //   }
    );
  }
  Goback():void{
    this.router.navigate(['/stock']);
  }
}
