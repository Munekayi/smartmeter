import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from "../app/shared/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  selectedUser: User = {
    email:'',
    password:'',
  };


  private apiUrl = 'http://localhost:3000/auth';
  private token: string | null = null;
  constructor(private http: HttpClient) { }



  public getToken(): string | null {
    if (this.token) {
      return this.token;
    } else {
      const token = localStorage.getItem('token');
      this.token = token;
      return token;
    }
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${email}`);
  }

  checkUserExists(email: string): Promise<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/${email}`)
      .toPromise()
      .then((response) => {
        if (typeof response === 'boolean') {
          return response;
        } else {
          throw new Error('Invalid server response');
        }
      })
      .catch((error) => {
        console.error(error);
        throw new Error('An error occurred while checking user exists');
      });
  }

  //check user login



  deleteToken(){
    localStorage.removeItem('token');
  }

  getUserPayLoad() {
    var token = localStorage.getItem('token');
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayLoad();
    if (userPayload)
    return userPayload.exp > Date.now() / 1000 ;
    else
      return false;
  }


  logout() {
    // TODO: Implement logout logic
  }


}
