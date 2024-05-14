export interface DailyRequest {
    collector: number,
    customer: string,
    typeDocument: number,
    documentPay: number,
    currency: number,
    zoneId: number,
    nroDocument: string,
    nroLoan: number,
    typePay: number,
    startDate: string,
    endDate: string,
    startDatePay: string,
    endDatePay: string,
    numPage: number,
    allPage: number,
    cantFile: number
}