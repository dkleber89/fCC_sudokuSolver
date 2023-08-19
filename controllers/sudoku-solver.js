class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return "Expected puzzle to be 81 characters long";
    }

    const VALIDATION_REGEX = /^[1-9\.]*$/;

    if (!VALIDATION_REGEX.test(puzzleString)) {
      return "Invalid characters in puzzle";
    }

    return "VALID";
  }

  rowCharToRowNumber(char) {
    return "abcdefghi".indexOf(char.toLowerCase()) + 1;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const startIndexOfRow = (this.rowCharToRowNumber(row) - 1) * 9;

    const rowString = puzzleString.slice(startIndexOfRow, startIndexOfRow + 9);

    const actualChar = rowString.charAt(column - 1);

    if (actualChar === value) {
      return true;
    }

    if (actualChar !== ".") {
      return false;
    }

    if (rowString.includes(value)) {
      return false;
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colString = puzzleString
      .split("")
      .filter((_char, index) => index % 9 === column - 1)
      .join("");

    const actualChar = colString.charAt(this.rowCharToRowNumber(row) - 1);

    if (actualChar === value) {
      return true;
    }

    if (actualChar !== ".") {
      return false;
    }

    if (colString.includes(value)) {
      return false;
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowNumber = this.rowCharToRowNumber(row);
    const regionCol = Math.ceil(column / 3);
    const regionRow = Math.ceil(rowNumber / 3);

    const validIndexes = Array.from(Array(81).keys()).filter((value) => {
      const startIndexOfRow = (regionRow - 1) * 27;
      const validForRow =
        value >= startIndexOfRow && value < startIndexOfRow + 27;

      const startCol = (regionCol - 1) * 3;
      const validForCol =
        value % 9 === startCol ||
        value % 9 === startCol + 1 ||
        value % 9 === startCol + 2;

      return validForRow && validForCol;
    });

    const regionString = puzzleString
      .split("")
      .filter((_char, index) => validIndexes.includes(index))
      .join("");

    const colOfRegion = column % 3 || 3;
    const rowOfRegion = rowNumber % 3 || 3;
    const actualChar = regionString.charAt(
      (rowOfRegion - 1) * 3 + (colOfRegion - 1)
    );

    if (actualChar === value) {
      return true;
    }

    if (actualChar !== ".") {
      return false;
    }

    if (regionString.includes(value)) {
      return false;
    }

    return true;
  }

  solve(puzzleString, index) {
    const actualIndex = index || 0;

    if (actualIndex >= 81) {
      return puzzleString;
    }

    if (/[1-9]/.test(puzzleString.charAt(actualIndex))) {
      return this.solve(puzzleString, actualIndex + 1);
    }

    const row = "abcdefghi".charAt(Math.floor(actualIndex / 9));
    const col = (actualIndex % 9) + 1;

    const possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      (validNumber) =>
        this.checkRowPlacement(puzzleString, row, col, validNumber) &&
        this.checkColPlacement(puzzleString, row, col, validNumber) &&
        this.checkRegionPlacement(puzzleString, row, col, validNumber)
    );

    if (possibleNumbers.length === 0) {
      return false;
    }

    for (const possibleNumber of possibleNumbers) {
      puzzleString = `${puzzleString.substring(
        0,
        actualIndex
      )}${possibleNumber}${puzzleString.substring(actualIndex + 1)}`;

      const newPuzzleString = this.solve(puzzleString, actualIndex + 1);

      if (newPuzzleString) {
        return newPuzzleString;
      }
    }

    puzzleString = `${puzzleString.substring(
      0,
      actualIndex
    )}.${puzzleString.substring(actualIndex + 1)}`;

    return false;
  }
}

module.exports = SudokuSolver;
