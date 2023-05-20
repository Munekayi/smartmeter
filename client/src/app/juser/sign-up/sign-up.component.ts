import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/shared/user.model';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSuccessMessage = false;
  serverErrorMessages = '';

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit() {}
  

  onSubmit(form: NgForm) {
    const newUser: User = form.value as User;
    this.userService
      .addUser(newUser)
      .pipe(
        tap(() => {
          this.resetForm(form);
        })
      )
      .subscribe({
        next: () => {
          this.showSuccessMessage = true;
          setTimeout(() => (this.showSuccessMessage = false), 4000);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.status === 422) {
            this.serverErrorMessages = err.error.join('<br/>');
          } else {
            this.serverErrorMessages = err.message;
          }
        }
      });
  }

  resetForm(form: NgForm) {
    form.reset();
    form.setValue({
      email: '',
      password: ''
    });

    this.serverErrorMessages = '';
  }
}
