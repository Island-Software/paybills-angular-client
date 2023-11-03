import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MONTHS } from '../../consts/months';
import { BillType } from '../../models/bill-type';
import { BillTypesService } from '../../services/bill-types.service';
import { BillsService } from '../../services/bills.service';

@Component({
  selector: 'app-bill-register',
  templateUrl: './bill-register.component.html',
  styleUrls: ['./bill-register.component.css']
})
export class BillRegisterComponent implements OnInit {
  @Output() saveBillEvent = new EventEmitter<boolean>();
  billTypes: BillType[] = [];
  // Reactive forms
  newBillForm!: UntypedFormGroup;
  months = MONTHS;

  constructor(private billsService: BillsService, private billTypesService: BillTypesService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadBillTypes();
  }

  loadBillTypes() {
    this.billTypesService.getBillTypes().subscribe(
      bt => this.billTypes = bt
    );
  }

  initializeForm() {
    this.newBillForm = new UntypedFormGroup({
      typeId: new UntypedFormControl('', Validators.required),
      value: new UntypedFormControl('', Validators.required),
      month: new UntypedFormControl(new Date().getMonth() + 1, Validators.required),
      year: new UntypedFormControl(new Date().getFullYear(), [Validators.required, Validators.minLength(4), Validators.maxLength(4)])
    })
  }

  add() {
    this.billsService.createBill(this.newBillForm.value).subscribe(_ => {
      this.toastrService.success("Bill added succesfully");
      this.closeAndReloadParent();
    }, error => {
      this.toastrService.error(error.error);
    });
  }

  close() {
    this.saveBillEvent.emit(false);
  }

  closeAndReloadParent() {
    this.saveBillEvent.emit(true);
  }

}
