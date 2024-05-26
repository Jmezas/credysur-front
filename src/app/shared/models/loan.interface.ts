export interface LoansReponse {
    total: number;
    item: number;
    iIdPrestamo: number;
    documento: string;
    sRazonSocial: string;
    sTelefono: string;
    moneda: string;
    serie: string;
    fechaEmision: string;
    fechaPagoFin: string;
    nTotal: number;
    nPendiente: number;
    expiredQuota: number;
    estado: string;
    fechaVenta: string;
    totalPaginas: number;
    numero: number;
}
export class LoanRequest {
    collector: number;
    customer: string;
    typeDocument: number;
    statePay: number;
    currency: number;
    zoneId: number;
    startDate: string;
    endDate: string;
    startDatePay: string;
    endDatePay: string;
    paymentMethod: number;
    numPage: number;
    allPage: number;
    cantFile: number;
}