import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { cardData } from 'src/app/shared/user.model';
import { tap } from 'rxjs/operators';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newcard',
  templateUrl: './newcard.component.html',
  styleUrls: ['./newcard.component.css']
})
export class NewcardComponent {
  showSuccessMessage = false;
  serverErrorMessages = '';
  readings!: cardData[];
  reading!: cardData;
  email!: string;
  cardNumber!: string;
  cardHolderName!: string;
  expirationDate!: string;
  cvv!: string;
  form!: NgForm;

  constructor(private userService: UserService, private router: Router) {}
  addCard(form: NgForm) {
    const newCard: cardData = {
      email: form.value.email,
      cardHolderName: form.value.cardHolderName,
      cardNumber: form.value.cardNumber,
      expirationDate: form.value.expirationDate,
      cvv: form.value.cvv
    };

    this.userService.addCard(newCard)
      .subscribe(
        (response) => {
          console.log('Reading added successfully:', response);
          // Perform any additional actions or show success message
        },
        (error) => {
          console.log('Error adding reading:', error);
          // Handle the error and show error message
        }
      );
  }
}
