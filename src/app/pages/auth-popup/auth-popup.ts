import { Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-auth-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-popup.html',
  styleUrls: ['./auth-popup.css'] // ✅ IMPORTANT
})
export class AuthPopup {

  private api = inject(Api);
  private dialogRef = inject(MatDialogRef<AuthPopup>);


  @Output() close = new EventEmitter<void>();

  step = signal<'check' | 'login' | 'register'>('check');

  employeeId = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  error = signal('');

  // ✅ Check employee
  checkEmployee() {
    this.api.checkEmployee(this.employeeId()).subscribe(exists => {
      if (exists) {
        this.step.set('login');
      } else {
        this.step.set('register');
      }
    });
  }

  // ✅ Login
  // login() {
  //   this.api.login(this.employeeId(), this.password()).subscribe(res => {
  //     if (res) {
  //       this.dialogRef.close(this.employeeId());
  //     } else {
  //       this.error.set('Invalid password');
  //     }
  //   });
  // }

  login() {
  if (!this.email().endsWith('@thoughtfocus.com')) {
    this.error.set('Only company email allowed');
    return;
  }

  this.api.login(this.email(), this.password()).then((res: any) => {
    if (res) {
      this.dialogRef.close(this.email()); // return email instead
    } else {
      this.error.set('Invalid email or password');
    }
  });
  // proceed with login
}

  // ✅ Register
  register() {

    if (!this.email().endsWith('@thoughtfocus.com')) {
      this.error.set('Email must be @thoughtfocus.com');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match');
      return;
    }

    this.api.register({
      employeeId: this.employeeId(),
      email: this.email(),
      password: this.password()
    }).subscribe(() => {
      this.step.set('login');
    });
  }
}
