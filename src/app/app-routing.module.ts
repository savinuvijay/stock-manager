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
import { AuthGuard } from "./auth.guard";
const routes: Routes = [
  // {path: '', redirectTo: 'direction', pathMatch: 'full'},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'additem', component: AdditemComponent, canActivate: [AuthGuard]},
  {path: 'stockitem/:id', component: StockItemComponent, canActivate: [AuthGuard]},
  {path: 'stock', component: StockComponent ,canActivate: [AuthGuard]},
  {path: 'item', component: ItemComponent, canActivate: [AuthGuard]},
  {path: 'sale', component: SaleComponent, canActivate: [AuthGuard]},
  {path: 'saleitems/:id', component: SaleItemsComponent, canActivate: [AuthGuard]},
  {path: 'sales', component: ViewSaleComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
