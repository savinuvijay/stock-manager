import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdditemComponent } from './additem/additem.component';
import { StockItemComponent } from './stock-item/stock-item.component';
import { StockComponent } from "./stock/stock.component";
import { ItemComponent } from './item/item.component';
import { SaleComponent } from './sale/sale.component';
import { SaleItemsComponent } from './sale-items/sale-items.component';
import { ViewSaleComponent } from './view-sale/view-sale.component';
const routes: Routes = [
  // {path: '', redirectTo: 'direction', pathMatch: 'full'},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'additem', component: AdditemComponent},
  {path: 'stockitem/:id', component: StockItemComponent},
  {path: 'stock', component: StockComponent},
  {path: 'item', component: ItemComponent},
  {path: 'sale', component: SaleComponent},
  {path: 'saleitems/:id', component: SaleItemsComponent},
  {path: 'sales', component: ViewSaleComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
