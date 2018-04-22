import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider, User } from '../../providers/auth/auth';
import { EmailValidator } from '../../validator/email';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'login',
  styles: [``],
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements OnInit {
 //  public loginForm: FormGroup;
  public showSpinner: boolean;
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public emailOk: boolean = false;
  public users: User[] = [];

  constructor(
    public route: Router,
    public authProvider: AuthProvider,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
  ) {
  }

  public ngOnInit() {
      this.firstFormGroup = this.formBuilder.group({
          email: ['',
              Validators.compose([Validators.required, EmailValidator.isValid])]
      });
      this.secondFormGroup = this.formBuilder.group({
          password: ['',
              Validators.compose([Validators.minLength(6), Validators.required])]
      });
      this.authProvider.getUsers().subscribe((users) => this.users = users)
  }

  public userExist(): boolean {
      const selectedUser = this.users.filter((user) => {
          return user.email === this.firstFormGroup.value.email;
      });

      return (selectedUser.length === 1);
  }

  public loginUser(): void {
    if (!this.firstFormGroup.valid) {
      console.log(this.firstFormGroup.value);
    } else {
      this.showSpinner = true;
      this.authProvider.loginUser(this.firstFormGroup.value.email,
        this.secondFormGroup.value.password)
        .then( () => {
            this.route.navigate(['/home']);
        }, (error) => {
          this.showSpinner = false;
          console.log(error);
          window.alert(error.message);
        });
    }
  }

  public signup(): void {
    this.authProvider.signupUser(this.firstFormGroup.value.email,
          this.secondFormGroup.value.password)
        .then(() => {
          this.route.navigate(['/home'], {queryParams: {newUser: this.firstFormGroup.value.email}});
        });
  }

  public resetPassword(): void {
    if (this.firstFormGroup.controls.email.valid) {
      this.authProvider.resetPassword(this.firstFormGroup.value.email)
        .then(() => {
           this.snackBar.open('Un messaqe permettant de réinitialisation votre mot de passe '
               + 'a été envoyé à l\'adresse ' + this.firstFormGroup.value.email);
        });
    } else {
        this.snackBar.open('Pour réinitialiser votre mot de passe, merci de saisir votre '
            + 'adresse email');
    }
  }
}
