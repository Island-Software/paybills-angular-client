import { Component, OnInit, TemplateRef } from '@angular/core';
import { Bill } from '../../models/bill';
import { Pagination } from '../../models/pagination';
import { BillsService } from '../../services/bills.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MONTHS } from 'src/app/consts/months';
import { ToastrService } from 'ngx-toastr';
import { faCopy, faSquarePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.css']
})
export class BillListComponent implements OnInit {
  bills: Bill[] = [];
  selectedBill?: Bill;
  pagination: Pagination | undefined;
  pageNumber = 1;
  pageSize = 10;
  username: string = '';
  modalRef!: BsModalRef;
  months = MONTHS;
  selectedMonth: number;
  selectedYear: number;
  loading: boolean;
  faDelete = faTrashCan;
  faAdd = faSquarePlus;
  faCopy = faCopy;
  selectedTotal: number = 0;
  total: number = 0;
  checkAllState: boolean = false;

  constructor(private billsService: BillsService, private modalService: BsModalService,
    private toastrServie: ToastrService) {
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = new Date().getFullYear();
    this.loading = false;
  }

  ngOnInit(): void {
    this.loadUser();
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadUser();
  }

  openModalForEdit(template: TemplateRef<any>, billToEdit: Bill) {
    this.selectedBill = billToEdit;
    // console.log(typeof(this.selectedBill.dueDate));

    // this.selectedBill.dueDate = new Date(this.selectedBill.dueDate[0]);
    this.modalRef = this.modalService.show(template);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal(value: boolean) {
    this.modalRef.hide();
    if (value)
      this.loadUser();
  }

  updateTotal() {
    this.billsService.getBills(this.username, this.selectedMonth, this.selectedYear).subscribe(bills => {
      // console.log(bills);

      this.total = bills.result.reduce((sum, current) => sum + current.value, 0);
    });
  }

  loadUser() {
    this.loading = true;
    this.username = JSON.parse(localStorage.getItem('user')!).username;
    this.billsService.getBills(this.username, this.selectedMonth, this.selectedYear, this.pageNumber, this.pageSize).subscribe(bills => {
      this.bills = bills.result;
      this.pagination = bills.pagination;
      this.loading = false;
    });

    this.updateTotal();
  }

  delete(bill: Bill) {
    if (confirm("Are you sure to delete " + bill.billType.description + "?")) {
      this.billsService.deleteBill(bill).subscribe(_ => this.loadUser());
    }
  }

  payBills() {
    if (confirm("Confirm the payment of all selected bills?")) {
      this.updatePaymentStatus(true);
    }
    this.updateSelectedTotal();
  }

  reopenBills() {
    if (confirm("Confirm the reopening of all selected bills?")) {
      this.updatePaymentStatus(false);
    }
    this.updateSelectedTotal();
  }

  updatePaymentStatus(paid: boolean) {
    let selectedBills = this.bills.filter(bill => bill.selected);
    selectedBills.forEach(b => {
      b.paid = paid;
      this.billsService.updateBill(b as any).subscribe();
      b.selected = false;
    });
    this.checkAllState = false;
  }

  selectAll(select: boolean) {
    this.bills.forEach(b => b.selected = select);
  }

  onFilterMonth() {
    this.loadUser();
  }

  onFilterYear() {
    if (this.selectedYear.toString().length === 4)
      this.loadUser();
  }

  copyBills() {
    if (confirm("Do you want to copy all bills from this month to the next?")) {
      this.billsService.copyBills(this.selectedMonth, this.selectedYear).subscribe(_ => {
        this.toastrServie.success("Bills copied successfuly");
      });
    }
  }

  clickMethod(name: string) {
    if (confirm("Are you sure to delete " + name)) {
      console.log("Implement delete functionality here");
    }
  }

  toggleSelect()
  {
    this.selectAll(!this.checkAllState);
    this.updateSelectedTotal()
  }

  selectAllPaid()
  {
    this.checkAllState = false;
    this.selectAll(false);
    this.bills.filter(b => b.paid).forEach(b => b.selected = true);
    this.updateSelectedTotal()
  } 
  
  selectAllOpen()
  {
    this.checkAllState = false;
    this.selectAll(false);
    this.bills.filter(b => !b.paid).forEach(b => b.selected = true);
    this.updateSelectedTotal()
  }

  updateSelectedTotal() {
    this.selectedTotal = 0;
    this.bills.filter(b => b.selected).map(b => this.selectedTotal += b.value);
  }
}
