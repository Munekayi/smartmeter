import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
const bcryptjs = require('bcryptjs');
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) { }
userDetails: any[]=[];
  ngOnInit() {
    
  }

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

}
