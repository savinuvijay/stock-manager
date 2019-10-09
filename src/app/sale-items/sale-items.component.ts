import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaleItemService } from '../sale-item.service';

@Component({
  selector: 'app-sale-items',
  templateUrl: './sale-items.component.html',
  styleUrls: ['./sale-items.component.css']
})
export class SaleItemsComponent implements OnInit {

  sale_id : number;
  sale_items : any[];

  constructor(private route : ActivatedRoute, private saleItemService : SaleItemService) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.sale_id = id;
    this.saleItemService.getSaleItemsBySaleId(id).subscribe( sale_items => {this.sale_items = sale_items;console.log(this.sale_items);} );
    //console.log(this.sale_items);
  }

}
