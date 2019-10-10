import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { AdditemComponent } from './additem/additem.component';
import { StockItemComponent } from './stock-item/stock-item.component';
import { StockComponent } from "./stock/stock.component";
import { ItemComponent } from "./item/item.component";
import { SaleComponent } from "./sale/sale.component";
import * as $ from 'jquery';
import * as bootstrap from "bootstrap";
import { SaleItemsComponent } from './sale-items/sale-items.component';
import { ViewSaleComponent } from './view-sale/view-sale.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdditemComponent,
    StockItemComponent,
    StockComponent,
    ItemComponent,
    SaleComponent,
    SaleItemsComponent,
    ViewSaleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
