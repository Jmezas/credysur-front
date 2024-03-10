import { Injectable } from '@angular/core'; 
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
    readonly DELIMITER = '/';

    format(date: NgbDateStruct): string {
      if (date === null) {
        return '';
      }
      return `${this.padNumber(date.day)}${this.DELIMITER}${this.padNumber(date.month)}${this.DELIMITER}${date.year}`;
    }
  
    parse(value: string): NgbDateStruct | null {
      if (!value) {
        return null;
      }
  
      const parts = value.trim().split(this.DELIMITER);
  
      if (parts.length !== 3) {
        return null;
      }
  
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
  
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return null;
      }
  
      return { day, month, year };
    }
  
    private padNumber(value: number): string {
      return value.toString().padStart(2, '0');
    }
}