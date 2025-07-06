import { ReceivingType } from "./receiving-type";

export interface Receiving {
    id: number;
    value: number;
    month: number;
    year: number;
    receivedDate: Date;
    received: boolean;
    selected?: boolean;
    receivingType: ReceivingType;
}

export interface NewReceivingDto {
    value: number;
    month: number;
    year: number;
    receivedDate: Date;
    received: boolean;
    typeId: number;
    userId: number;
}

export interface UpdateReceivingDto {
    id: number;
    value: number;
    month: number;
    year: number;
    receivedDate: Date;
    received: boolean;
    typeId: number;
    userId: number;
}

export interface CopyReceivingDto {
    userId: number;
    currentMonth: number;
    currentYear: number;
}