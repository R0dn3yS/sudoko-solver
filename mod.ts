import { Cell } from "./cell.ts";
import { removeItemOnce } from "./util.ts";

const input = Deno.readTextFileSync('./input.txt').trim().split('\n');

const grid: Cell[][] = [ [], [], [], [], [], [], [], [] ,[] ];

function initBoard() {
  for (let line = 0; line < 9; line++) {
    for (let num = 0; num < 9; num++) {
      grid[line][num] = new Cell(input[line][num]);
    }
  }

  for (let line = 0; line < 9; line++) {
    for (let num = 0; num < 9; num++) {
      let possible = grid[line][num].possible;

      for (const removeNum of checkRow(line)) {
        possible = removeItemOnce(possible, removeNum);
      }

      for (const removeNum of checkCol(num)) {
        possible = removeItemOnce(possible, removeNum);
      }

      for (const removeNum of checkSquare(num, line)) {
        possible = removeItemOnce(possible, removeNum);
      }
    }
  }
}

function checkRow(row: number): string[] {
  const output: string[] = [];

  for (const num of grid[row]) {
    if (num.value !== '_') output.push(num.value);
  }

  return output;
}

function checkCol(col: number): string[] {
  const output: string[] = [];

  for (let line = 0; line < 9; line++) {
    output.push(grid[line][col].value);
  }

  return output;
}

function checkSquare(col: number, row: number): string[] {
  const output: string[] = [];

  const colPos = col - col % 3;
  const colsToCheck = [ colPos, colPos + 1, colPos + 2];

  const rowPos = row - row % 3;
  const rowsToCheck = [rowPos, rowPos + 1, rowPos + 2];

  for (const r of rowsToCheck) {
    for (const c of colsToCheck) {
      output.push(grid[r][c].value);
    }
  }

  return output;
}

function leastEntropyIndex(): string[] {
  const arr = entropySize();
  const output: string[] = [];

  let searchFor = 8;

  for (let row = 0; row < 9; row++) {
    for (let i = 8; i > 0; i--) {
      if (arr[row].includes(i)) {
        searchFor = i;
      }
    }
  }

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (arr[row][col] === searchFor) {
        output.push(`${row} ${col}`);
      }
    }
  }

  return output;
}

function entropySize(): number[][] {
  const arr: number[][] = [ [], [], [], [], [], [], [], [] ,[] ];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      arr[row].push(grid[row][col].possible.length);
    }
  }

  return arr;
}

initBoard();

let play = true;
while(play) {
  const entArr = leastEntropyIndex();

  if (entArr.length === 0) {
    play = false;
    break;
  }

  const entToCollapse = entArr[Math.floor(Math.random() * entArr.length)];

  const row = parseInt(entToCollapse.split(' ')[0]);
  const col = parseInt(entToCollapse.split(' ')[1]);

  const cellToCollapse = grid[row][col];
  const newValue = cellToCollapse.possible[Math.floor(Math.random() * cellToCollapse.possible.length)]

  cellToCollapse.collapsed = true;
  cellToCollapse.possible = [];
  cellToCollapse.value = newValue;

  grid[row][col] = cellToCollapse;

  for (let line = 0; line < 9; line++) {
    for (let num = 0; num < 9; num++) {
      let possible = grid[line][num].possible;

      for (const removeNum of checkRow(line)) {
        possible = removeItemOnce(possible, removeNum);
      }

      for (const removeNum of checkCol(num)) {
        possible = removeItemOnce(possible, removeNum);
      }

      for (const removeNum of checkSquare(num, line)) {
        possible = removeItemOnce(possible, removeNum);
      }
    }
  }
}

for (let i = 0; i < 9; i++) {
  console.log(`${grid[i][0].value}${grid[i][1].value}${grid[i][2].value} ${grid[i][3].value}${grid[i][4].value}${grid[i][5].value} ${grid[i][6].value}${grid[i][7].value}${grid[i][8].value}`);
}