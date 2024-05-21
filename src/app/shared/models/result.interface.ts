export interface Result {
    traceId: string;
    payload: {
      data: any | any[];
      total?: number;
      totalPage: number;
    };
    success:boolean;
    message:string;
    statusCode:number;
  }
  