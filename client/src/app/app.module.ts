import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SignUpComponent } from './juser/sign-up/sign-up.component';
import { LoginComponent } from './juser/login/login.component';
import { JuserComponent } from './juser/juser.component';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';

//routes
import { appRoutes } from "./routes";
import { BillingComponent } from './billing/billing.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';


//other
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './shared/user.service';
import { NewcardComponent } from './newcard/newcard/newcard.component';
import { FormsComponent } from './forms/forms.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    HeaderComponent,
    SignUpComponent,
    LoginComponent,
    JuserComponent,
    BillingComponent,
    NotificationsComponent,
    ProfileComponent,
    NewcardComponent,
    FormsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    // * MATERIAL IMPORTS
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatTooltipModule 
  ],

  providers: [AuthGuard,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
