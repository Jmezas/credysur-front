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
    ExpiredQuota: number;
    estado: string;
    fechaVenta: string;
    totalPaginas: number;
    numero: number;
}