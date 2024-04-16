export interface LoanRequest {
    customerID: number;
    serie: string;
    numero: number;
    dateIssue: string;
    currency: number;
    amount: number;
    interest: number;
    quota: number;
    fromPay: number;
    quotaValue: number;
    interestGained: number;
    total: number;
    userId?: string;
    observation: string;
}
export  interface Calculate {
    amount: number;
    rateInterestAnnual: number;
    quotaNumber: number;
    formePay: number;
    optionFrequency: number;
    startDate: string;
    userId?: string;
}