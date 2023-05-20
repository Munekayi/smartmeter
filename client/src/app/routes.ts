import { Routes } from '@angular/router';
import { JuserComponent } from './juser/juser.component';
import { SignUpComponent } from './juser/sign-up/sign-up.component';
import { LoginComponent } from './juser/login/login.component';

export const appRoutes: Routes = [
    {
        path: 'signup', component: JuserComponent,
        children: [{ path: '', component: SignUpComponent }]
    },
    {
        path: 'login', component: JuserComponent,
        children: [{ path: '', component: LoginComponent }]
    },
    {
        path: '', redirectTo: '/signup', pathMatch: 'full'
    }
];