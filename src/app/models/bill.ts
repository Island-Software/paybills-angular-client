import { BillType } from "./bill-type";

export interface Bill {
    id: number;
    value: number;
    month: number;
    year: number;
    dueDate: Date;
    billType: BillType;
}

export interface NewBillDto {
    value: number;
    month: number;
    year: number;
    dueDate: Date;
    typeId: number;
    userId: number;
}

export interface UpdateBillDto {
    id: number;
    value: number;
    month: number;
    year: number;
    dueDate: Date;
    typeId: number;
    userId: number;
}

export interface CopyBillDto {
    userId: number;
    currentMonth: number;
    currentYear: number;
}