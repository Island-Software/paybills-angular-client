import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MONTHS } from 'src/app/consts/months';
import { ReceivingType } from 'src/app/models/receiving-type';
import { ReceivingTypesService } from 'src/app/services/receiving-types.service';
import { ReceivingService } from 'src/app/services/receiving.service';

@Component({
  selector: 'app-receiving-register',
  templateUrl: './receiving-register.component.html',
  styleUrls: ['./receiving-register.component.css']
})
export class ReceivingRegisterComponent implements OnInit {
  @Output() saveReceivingEvent = new EventEmitter<boolean>();
  receivingTypes: ReceivingType[] = [];
  // Reactive forms
  newReceivingForm!: UntypedFormGroup;
  months = MONTHS;

  constructor(private billsService: ReceivingService, private receivingTypesService: ReceivingTypesService, private toastrService: ToastrService,
    public datePipe : DatePipe) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadBillTypes();    
  }

  loadBillTypes() {
    this.receivingTypesService.getReceivingTypes().subscribe(
      bt => this.receivingTypes = bt
    );
  }

  initializeForm() {
    var currentDate = new Date();
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    this.newReceivingForm = new UntypedFormGroup({
      typeId: new UntypedFormControl('', Validators.required),
      value: new UntypedFormControl('', Validators.required),
      month: new UntypedFormControl(new Date().getMonth() + 1, Validators.required),
      year: new UntypedFormControl(new Date().getFullYear(), [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
      dueDate: new UntypedFormControl(undefined)
    })
  }

  add() {

    this.billsService.create(this.newReceivingForm.value).subscribe(_ => {
      this.toastrService.success("Bill added succesfully");
      this.closeAndReloadParent();
    }, error => {
      this.toastrService.error(error.error);
    });
  }

  close() {
    this.saveReceivingEvent.emit(false);
  }

  closeAndReloadParent() {
    this.saveReceivingEvent.emit(true);
  }

  onValueChange(value: Date): void {
    if (value === undefined)
      return    
    
    value.setHours(0);
    value.setMinutes(0);
    value.setSeconds(0);    
  }

}
