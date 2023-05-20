import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
 showSuccessMessage: boolean = false;
  serverErrorMessages = " ";

  users!: User[];
  user!: User;
  email!: string;
  password!: string;

  constructor(public userService: UserService, private router: Router) {}



  onLogin(form: NgForm): void {
    const email = form.value.email;
    const password = form.value.password;
  
    // Check if user exists in the database
    this.userService.login(form.value).subscribe(

      (res:any) =>{
        if(res.token){
        this.userService.setToken(res.token);
        this.showSuccessMessage = true;
        console.log(this.showSuccessMessage); // Check if it's true
        setTimeout(() => {
          //this.showSucessMessage = false;
        }, 4000);
        this.router.navigateByUrl('/dashboard');
        }
      },
      (err: HttpErrorResponse) => {
        this.serverErrorMessages = err.error.message;
      }
    );
    
  }
  
    // Navigate to home page, assuming you have a router set up
    // Replace `home` with the actual route name of your home page
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 
  ngOnInit() {
    if(this.userService.isLoggedIn())
    this.router.navigateByUrl('/dashboard');
  }

  

  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      email:' ',
      password:''
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }

}

