export interface Result {
    traceId: string;
    payload: {
      data: any | any[];
      total?: number;
      totalPage: number;
    };
  }
  