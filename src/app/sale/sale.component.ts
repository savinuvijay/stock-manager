import { Component, OnInit } from '@angular/core';
import { StockService } from '../stock.service';
import { Stock } from '../stock';
import { NgForm, Validators, FormBuilder } from '@angular/forms';
import { StockItem } from '../stock-item';
import { StockItemService } from "../stock-item.service";
import { SelectedItem } from '../selecteItem';
import { Sale } from '../sale';
import { SaleService } from '../sale.service';
import { SaleItemService } from '../sale-item.service';
import { SaleItem } from '../sale_item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
  stocks : Stock[];
  stock_items : StockItem[];
  currentStock : Stock;
  currentItem : StockItem;
  remainingQuantity : number;
  itemTotalPrice : number;
  selectedItems : SelectedItem[] = [];
  saleItems : any[] = [];
  alreadySelected : SelectedItem;
  ItemForm: any;
  grandTotal: number = 0;
  curDate:Date;
  lastSale:Sale;

  constructor(
    private stockService: StockService, 
    private saleService: SaleService, 
    private formbulider: FormBuilder, 
    private stockItmeService: StockItemService,
    private saleItemService: SaleItemService,
    private router : Router
    ) {
    this.ItemForm = this.formbulider.group({    
      STOCK_ID: ['', [Validators.required]],  
      STOCK_ITEM_ID: ['', [Validators.required]],
      QUANTITY: ['', [Validators.required]]
    });
   }
  ngOnInit() {
    this.curDate=new Date();
    console.log(this.curDate);
  }

  getStock():void{
    this.stockService.getStock().subscribe(
      stocks => {
        this.stocks = stocks;
        console.log(stocks);
    });
  }
  selectedStock(id:any):void{
    console.log("selectedStock");
    console.log(id);
    this.currentStock = this.stocks.find(x=>x.STOCK_ID == id);
    this.getStockItems(id);
  }

  selectedItem(id:any):void{
    console.log("selectedItem");
    this.alreadySelected = this.selectedItems.find(x=>x.STOCK_ITEM_ID == id);
    if(this.alreadySelected == null ){
      this.currentItem = this.stock_items.find(x=>x.STOCK_ITEM_ID == id);
      this.remainingQuantity = this.currentItem.QUANTITY;
      this.itemTotalPrice = 0;
      console.log(this.currentItem);
    }
  }

  getStockItems(id : number): void{
    this.stockItmeService.getStockItems(id).subscribe( 
      stock_items => {
        this.stock_items = stock_items;
        console.log("stock items");
        console.log(this.stock_items);
      });
  }

  changeRemainingQuantity(quantity: number){
    this.remainingQuantity = this.currentItem.QUANTITY - quantity;
    this.itemTotalPrice = quantity * this.currentItem.SELLING_PRICE;
  }

  addSaleItem(form: NgForm): void{
    var data = form.value;
    var currentItemData = {
      STOCK_ID: this.currentStock.STOCK_ID,
      STOCK_NAME: this.currentStock.STOCK_NAME,
      STOCK_ITEM_ID: this.currentItem.STOCK_ITEM_ID,
      ITEM_ID: this.currentItem.ITEM_ID,
      ITEM_NAME: this.currentItem.ITEM_NAME,
      QUANTITY: data.QUANTITY,
      PRICE : this.currentItem.SELLING_PRICE,
    };
    var newSaleEntry = 
      { STOCK_ID: this.currentStock.STOCK_ID,
        STOCK_ITEM_ID: this.currentItem.STOCK_ITEM_ID,
        ITEM_ID: this.currentItem.ITEM_ID,
        ITEM_NAME: this.currentItem.ITEM_NAME,
        QUANTITY: data.QUANTITY };
    this.selectedItems.push(currentItemData);
    this.saleItems.push(newSaleEntry);
    this.grandTotal += this.itemTotalPrice;
    this.remainingQuantity = 0;
    this.itemTotalPrice = 0;
    this.currentStock = null;
    this.currentItem = null;
    console.log(currentItemData);
    console.log("function called");   
    jQuery('#addItemSaleModal').modal("hide");
    form.reset();
  }
  completeSale() : void{
    console.log("Completing sale");
    var currentSale = {
      TOTAL_PRICE : this.grandTotal,
      SALE_DATE : this.curDate
    }
    console.log(currentSale);
    this.saleService.AddSale(currentSale).subscribe(    
      ()=>    
      {    
        console.log("Adding New Stock : ");
        this.saleService.getLastSale().subscribe(
          lastSale => {
            this.lastSale = lastSale;
            console.log("New Stock : ");
            console.log(this.lastSale);
            console.log(this.saleItems);
            this.addSaleItems(this.saleItems, this.lastSale.SALE_ID);
            jQuery('#addSaleModal').modal("hide");
            //this.router.navigate(['/saleitems/'+this.lastSale.SALE_ID]);
          }
        );
        //this.router.navigate(['/saleitems/'+this.lastSale.SALE_ID]);
      }); 
  }
  addSaleItems(selecteItems : SelectedItem[], lastSaleId : number):void{
    if (!selecteItems) { return; }
    var sale_items_list = {
      sale_items : selecteItems,
      sale_id : lastSaleId
    }
    this.saleItemService.addSaleItems(sale_items_list).subscribe(
       () => {
    //     this.courses.push(course);
          this.router.navigate(['/saleitems/'+this.lastSale.SALE_ID]);
       }
    );
    this.stockItmeService.updateItemQuantity(selecteItems).subscribe(
      () => {
   //     this.courses.push(course);
         //this.router.navigate(['/saleitems/'+this.lastSale.SALE_ID]);
      }
   );
  }
  Goback():void{
    this.router.navigate(['/dashboard']);
  }
}
