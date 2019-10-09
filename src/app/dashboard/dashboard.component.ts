import { Component, OnInit } from '@angular/core';
import { Item } from '../item'
import { Stock } from '../stock'
import { DashboardService } from '../dashboard.service'
import { Router } from '@angular/router';
import { AdditemService } from '../additem.service';
import { StockItemComponent } from '../stock-item/stock-item.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  model : any={}; 
  items : Item[];
  item : Item;
  stock_id : number;
  constructor(private router:Router, private dashboardService : DashboardService, private addItemService: AdditemService) { }

  ngOnInit() {
    this.getItems();
    this.stock_id = 20;
  }
  getItems(): void{
    this.dashboardService.getItems().subscribe( items => this.items = items );
    console.log(this.items);
  }

  ViewItems():void{
    console.log("button worked")
    this.router.navigate(['/item']); 
  }

  sale():void{
    console.log("button worked")
    this.router.navigate(['/sale']); 
  }
  addItem():void{
    console.log("button worked")
    this.router.navigate(['/additem']); 
  }

  addStockItem(id : number):void{
    this.router.navigate(['/stockitem/'+id]); 
  }

  removeItem(id : number):void{

    this.addItemService.deleteItem(id).subscribe(item => {this.item = item;
      this.ngOnInit();
    });
  }

  ViewStock():void{
    this.router.navigate(['/stock']);
  }
  ViewSales():void{
    this.router.navigate(['/sales']);
  }
}
