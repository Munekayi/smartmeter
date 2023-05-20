import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { BillingComponent } from './billing/billing.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './juser/login/login.component';
import { SignUpComponent } from './juser/sign-up/sign-up.component';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewcardComponent } from './newcard/newcard/newcard.component';
import { FormsComponent } from './forms/forms.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard] },
  { path: 'billing', component: BillingComponent , canActivate:[AuthGuard] },
  { path: 'notifications', component: NotificationsComponent , canActivate:[AuthGuard] },
  { path: 'profile', component: ProfileComponent , canActivate:[AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'addnewcard', component: NewcardComponent , canActivate:[AuthGuard] },
  { path: 'forms', component: FormsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}