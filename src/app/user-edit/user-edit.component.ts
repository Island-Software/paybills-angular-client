import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { UserEdit } from '../models/user';
import { AccountService } from '../services/account.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  editUserForm = this.formBuilder.group({
    userName: [''],
    email: ['', [Validators.email]],
    password: ["", [Validators.minLength(4), Validators.maxLength(16)]],
    confirmPassword: ["", [Validators.minLength(4), Validators.maxLength(16), this.matchValues('password')]]
  });
  userName: any;
  currentUser: UserEdit | null = null;
  
  constructor(accountService: AccountService, private userService: UsersService, private formBuilder: FormBuilder, private toastr: ToastrService) {
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.userName = user.username      
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
  }

  ngOnInit(): void {      
    this.loadUser();      
    this.editUserForm.controls['password'].valueChanges.subscribe({
      next: () => this.editUserForm.controls['confirmPassword'].updateValueAndValidity()
    })  
  }

  loadUser() {    
    if (!this.userName) return;
      this.userService.getUser(this.userName).subscribe((apiUser) => {        
        this.currentUser = apiUser;
        this.editUserForm.controls["userName"].setValue(apiUser.userName);
        this.editUserForm.controls["email"].setValue(apiUser.email);
      });
      this.editUserForm.controls["userName"].disable();
  }

  update() {
    this.userService.update(this.userService.getCurrentUserId(), this.editUserForm.value).subscribe({
      complete: () => {
        this.toastr.success("Changes saved succesfully", "", { positionClass: 'toast-bottom-center'});
        this.editUserForm.controls["password"].setValue("");
        this.editUserForm.controls["confirmPassword"].setValue("");
      } 
    });
  }
}
