const chai = require("chai");
const assert = chai.assert;

const toShortPuzzleString =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.";
const invalidPuzzleString =
  "1.5..2.84..63.12.7.2..5.....9..1...f.8.2.3674.3.7.2..9.47...8..1..16....96914.37.";

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();
const puzzleStrings = require("../controllers/puzzle-strings");

suite("Unit Tests", () => {
  suite("Sudoku Solver", () => {
    test("validate Method", () => {
      assert.equal(solver.validate(puzzleStrings[0][0]), "VALID");
      assert.equal(
        solver.validate(toShortPuzzleString),
        "Expected puzzle to be 81 characters long"
      );
      assert.equal(
        solver.validate(invalidPuzzleString),
        "Invalid characters in puzzle"
      );
    });

    test("checkRowPlacement Method", () => {
      assert.isTrue(
        solver.checkRowPlacement(puzzleStrings[0][0], "A", "2", "9")
      );
      assert.isTrue(
        solver.checkRowPlacement(puzzleStrings[0][0], "A", "1", "1")
      );
      assert.isFalse(
        solver.checkRowPlacement(puzzleStrings[0][0], "a", "1", "9")
      );
      assert.isFalse(
        solver.checkRowPlacement(puzzleStrings[0][0], "a", "4", "5")
      );
      assert.isTrue(
        solver.checkRowPlacement(puzzleStrings[0][0], "e", "4", "1")
      );
      assert.isFalse(
        solver.checkRowPlacement(puzzleStrings[0][0], "f", "1", "8")
      );
      assert.isFalse(
        solver.checkRowPlacement(puzzleStrings[0][0], "G", "4", "1")
      );
    });

    test("checkColPlacement Method", () => {
      assert.isTrue(
        solver.checkColPlacement(puzzleStrings[0][0], "A", "2", "4")
      );
      assert.isTrue(
        solver.checkColPlacement(puzzleStrings[0][0], "A", "1", "1")
      );
      assert.isFalse(
        solver.checkColPlacement(puzzleStrings[0][0], "c", "2", "8")
      );
      assert.isFalse(
        solver.checkColPlacement(puzzleStrings[0][0], "b", "2", "6")
      );
      assert.isTrue(
        solver.checkColPlacement(puzzleStrings[0][0], "e", "4", "2")
      );
      assert.isFalse(
        solver.checkColPlacement(puzzleStrings[0][0], "f", "1", "5")
      );
      assert.isFalse(
        solver.checkColPlacement(puzzleStrings[0][0], "G", "4", "6")
      );
    });

    test("checkRegionPlacement Method", () => {
      assert.isTrue(
        solver.checkRegionPlacement(puzzleStrings[0][0], "A", "2", "4")
      );
      assert.isTrue(
        solver.checkRegionPlacement(puzzleStrings[0][0], "A", "1", "1")
      );
      assert.isFalse(
        solver.checkRegionPlacement(puzzleStrings[0][0], "c", "2", "8")
      );
      assert.isFalse(
        solver.checkRegionPlacement(puzzleStrings[0][0], "b", "2", "6")
      );
      assert.isTrue(
        solver.checkRegionPlacement(puzzleStrings[0][0], "e", "4", "4")
      );
      assert.isFalse(
        solver.checkRegionPlacement(puzzleStrings[0][0], "f", "1", "5")
      );
      assert.isFalse(
        solver.checkRegionPlacement(puzzleStrings[0][0], "G", "4", "4")
      );
    });

    test("solve Method", () => {
      assert.equal(solver.solve(puzzleStrings[0][0]), puzzleStrings[0][1]);
      assert.equal(solver.solve(puzzleStrings[1][0]), puzzleStrings[1][1]);
      assert.equal(solver.solve(puzzleStrings[2][0]), puzzleStrings[2][1]);
      assert.equal(solver.solve(puzzleStrings[3][0]), puzzleStrings[3][1]);
      assert.equal(solver.solve(puzzleStrings[4][0]), puzzleStrings[4][1]);

      assert.equal(solver.solve(puzzleStrings[5][0]), puzzleStrings[5][1]);
    });
  });
});
