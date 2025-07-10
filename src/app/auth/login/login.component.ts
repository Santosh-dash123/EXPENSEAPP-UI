import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { debug } from 'node:console';

@Component({
  selector: 'app-login',
  imports:[FormsModule,CommonModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginUser: Partial<User> = {
    email: '',
    phoneNumber:'',
    password: ''
  };

  loginError = '';
  emailEmpty = '';
  passwordEmpty = '';

  constructor(
    private router: Router,        
    private userService: UserService 
  ) {} 

  login() {
    debugger;
    if(this.loginUser.email == '' || this.loginUser.email == null)
    {
      this.emailEmpty = 'Email Is Required !';
    }
     if(this.loginUser.password == '' || this.loginUser.password == null)
    {
      this.passwordEmpty = 'Password Is Required !';
    }
    if (this.emailEmpty || this.passwordEmpty) {
      return; 
    } 

    const input = this.loginUser.email ? this.loginUser.email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    let isEmail = false;
    let isPhone = false;

    if (emailRegex.test(input)) {
      isEmail = true;
    } else if (phoneRegex.test(input)) {
      isPhone = true;
    } else {
      this.emailEmpty = 'Please enter a valid email or phone number.';
      return;
    }

    if(isEmail)
    {
      this.loginUser.email = input;
      this.loginUser.phoneNumber = '';
    }
    else
    {
      this.loginUser.phoneNumber = input;
      this.loginUser.email = '';
    }

   this.userService.CheckLogin(this.loginUser).subscribe({
      next: (res) => {
        if (res && res.data) {
          const userType = res.data.userType;
          this.userService.setUserType(res.data.userType);
          this.userService.setUserName(res.data.name);

          if (userType === 1) {
            this.router.navigate(['/admin/dashboard']);
          } else if (userType === 2) {
            this.router.navigate(['/employee/home']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.loginError = "Invalid login credentials.";
        }
      },
      error: () => {
        this.loginError = "Login failed. Please check your credentials.";
      }
    });
  }
}
