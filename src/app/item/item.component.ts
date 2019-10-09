import { Component, OnInit } from '@angular/core';
import { ItemService } from "../item.service";
import { Item } from '../item';
import { NgForm, Validators, FormBuilder } from '@angular/forms';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  items : Item[];
  item : Item;
  ItemForm: any;
  constructor(private itemService : ItemService, private formbulider: FormBuilder) { }

  ngOnInit() {
    this.getItems();
    this.ItemForm = this.formbulider.group({    
      NAME: ['', [Validators.required]],  
    }); 
  }
  getItems(): void{
    this.itemService.getItems().subscribe( items => this.items = items );
    console.log(this.items);
  }

  removeItem(id : number):void{
    this.itemService.deleteItem(id).subscribe(item => {this.item = item;
      this.ngOnInit();
    });
  }

  addItem(form: NgForm)    
  { 
    var item = form.value;
    console.log("function called");   
  this.itemService.AddItem(item).subscribe(    
    (item)=>    
    {      
      console.log(item);
      jQuery('#addItemModal').modal("hide");
      form.reset();
      this.ngOnInit();
    });    
  }    
}
