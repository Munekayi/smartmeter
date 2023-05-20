import { Injectable } from '@angular/core';
import { User, voucherData } from "./user.model";
import { cardData } from "./user.model";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private processedVoucher: any; 
  selectedUser: User = {
    email:'',
    password:'',
  };
  selectedcardData: cardData = {
    email: '',
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: ''
  };
  selectedvoucherData: voucherData = {
    voucherNumber: ''
  };
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  //retrieving UserService
  getUsers()
  {
    return this.http.get('http://localhost:3000/api/users');
  }
  getCard(){
    const token = this.getToken();
    // Set the authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:3000/api/card',{ headers });
  }
  setProcessedVoucher(voucher: any): void {
    this.processedVoucher = voucher;
  }
  
  getProcessedVoucher(): any {
    return this.processedVoucher;
  }
  getvoucherPayment(voucherNumber: voucherData){
    const token = this.getToken();
    // Set the authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`http://localhost:3000/api/vouchers/${voucherNumber}`, { headers })
    .pipe(
      tap((voucher: any) => {
        // Store the processed voucher values
        this.setProcessedVoucher(voucher);
      })
    );
  }
  addCard(newCard: cardData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('http://localhost:3000/api/card',newCard,httpOptions)
    .pipe(map((res:any) => (<any>res).json()));
  }
  //add User Method
  addUser(newUser: User)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post('http://localhost:3000/api/user', newUser, httpOptions);
  }

  //delete Method
  deleteUser(id: User)
  {
    return this.http.delete('http://localhost:3000/api/user/'+id);
  }

  login(authCredentials: User)
  {
    return this.http.post('http://localhost:3000/api/authenticate', authCredentials);
  }
 
  getUserProfile() {
    const token = this.getToken();
    // Set the authorization header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:3000/api/userprofile', { headers });
    //return this.http.get('http://localhost:3306/api/userprofile');
    }
    getSensorData(meterId: string) {
      const token = this.getToken();
      // Set the authorization header
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      // Use the interval operator to trigger the request every 30 seconds
      return interval(30000).pipe(
      startWith(0), // Trigger the first request immediately
      switchMap(() => this.http.get(`http://localhost:3000/api/sensordata/${meterId}`, { headers }))
      );
    }

    updateSensorData(meterId: string) {
      const token = this.getToken();
      // Set the authorization header
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
     // const body = { amountowing: amount };
      return this.http.put(`http://localhost:3000/api/sensordata/${meterId}`,null, { headers });
    }
    
  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }


  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
}
