import { Component, OnInit } from '@angular/core';
import { Sale } from '../sale';
import { SaleService } from '../sale.service';
import { SaleItemService } from '../sale-item.service';

@Component({
  selector: 'app-view-sale',
  templateUrl: './view-sale.component.html',
  styleUrls: ['./view-sale.component.css']
})
export class ViewSaleComponent implements OnInit {

  sales : Sale[];
  sale_items : any[];
  grand_total : number;
  constructor(private saleService: SaleService, private saleItemService: SaleItemService) { }

  ngOnInit() {
    this.getSales()
  }

  getSales(): void{
    this.saleService.getSale().subscribe( sales => this.sales = sales );
    console.log(this.sales);
  }

  getSaleItems(id:number, total:number){
    this.saleItemService.getSaleItemsBySaleId(id).subscribe( sale_items => 
      {
        this.sale_items = sale_items;
        this.grand_total = total;
      });
  }

}
