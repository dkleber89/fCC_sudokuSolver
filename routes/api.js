"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { coordinate, puzzle, value } = req.body;

    if (!coordinate || !puzzle || !value) {
      res.json({ error: "Required field(s) missing" });

      return;
    }

    const validationResult = solver.validate(puzzle);

    if (validationResult !== "VALID") {
      res.json({ error: validationResult });

      return;
    }

    const VALUE_REGEX = /^[1-9]{1}$/;

    if (!VALUE_REGEX.test(value)) {
      res.json({ error: "Invalid value" });

      return;
    }

    const COORDINATE_REGEX = /^[A-Ia-i]{1}[1-9]{1}$/;

    if (!COORDINATE_REGEX.test(coordinate)) {
      res.json({ error: "Invalid coordinate" });

      return;
    }

    const [row, col] = coordinate.split("");

    const conflict = [];

    if (!solver.checkRowPlacement(puzzle, row, col, value)) {
      conflict.push("row");
    }

    if (!solver.checkColPlacement(puzzle, row, col, value)) {
      conflict.push("column");
    }

    if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
      conflict.push("region");
    }

    res.json({
      valid: conflict.length === 0,
      conflict: conflict.length >= 1 ? conflict : undefined,
    });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      res.json({ error: "Required field missing" });

      return;
    }

    const validationResult = solver.validate(puzzle);

    if (validationResult !== "VALID") {
      res.json({ error: validationResult });

      return;
    }

    const solution = solver.solve(puzzle);

    if (solution) {
      res.json({ solution });
    } else {
      res.json({ error: "Puzzle cannot be solved" });
    }
  });
};
