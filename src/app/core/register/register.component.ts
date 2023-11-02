import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Property to receive data from parent component
  // @Input() usersFromHomeComponent: any;
  // Property to send data to parent component
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  newUserForm!: UntypedFormGroup;

  constructor(private accountService: AccountService, 
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.newUserForm = new UntypedFormGroup({
      username: new UntypedFormControl('', Validators.required),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)])
    })
  }

  onUserText() {
    this.model.password = this.model.username;
  }

  // onKey(event: any) { // without type info
  //   this.model.password = this.model.username;
  // }

  register() {
    this.accountService.register(this.newUserForm.value).subscribe(response => {      
      this.cancel();
    }, error => {
      console.log(error.error);
    });
  }

  cancel() {
    // Works like an event
    this.cancelRegister.emit(false);
  }
}
