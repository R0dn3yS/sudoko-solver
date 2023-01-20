export class Cell {
  value: string;
  collapsed: boolean;
  possible: string[];


  constructor(num: string) {
    this.value = num;
    this.collapsed = num === '_' ? false : true;
    this.possible = num === '_' ? [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ] : [];
  }

  entropy(): number {
    return this.possible.length;
  }
}