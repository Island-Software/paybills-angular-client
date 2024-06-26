import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { text } from '@fortawesome/fontawesome-svg-core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginUser } from '../models/login-user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<LoginUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(model: any) {
    return this.http.post<LoginUser>(this.baseUrl + 'account/login', model).pipe(
      map((response: LoginUser) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<LoginUser>(this.baseUrl + 'account/register', model).pipe(
      map((user: LoginUser) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  setCurrentUser(user: LoginUser) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
  }

  validateEmail(email: string, emailToken: string) {
    return this.http.get(this.baseUrl + 'email/validate?email=' + email + '&emailToken=' + emailToken);
  }
}
