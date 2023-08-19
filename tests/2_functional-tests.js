const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

const toShortPuzzleString =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.";
const invalidPuzzleString =
  "1.5..2.84..63.12.7.2..5.....9..1...f.8.2.3674.3.7.2..9.47...8..1..16....96914.37.";

const puzzleStrings = require("../controllers/puzzle-strings");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("Check", () => {
    test("Check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ coordinate: "A1", value: "1", puzzle: puzzleStrings[0][0] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isUndefined(res.body.conflict);
          assert.isTrue(res.body.valid);

          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ coordinate: "A2", value: "4", puzzle: puzzleStrings[0][0] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.conflict);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row"]);

          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ coordinate: "A2", value: "5", puzzle: puzzleStrings[0][0] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.conflict);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row", "region"]);

          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ coordinate: "A1", value: "2", puzzle: puzzleStrings[0][0] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.conflict);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ["row", "column", "region"]);

          done();
        });
    });

    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ value: "2", puzzle: puzzleStrings[0][0] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");

          done();
        });
    });

    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ coordinate: "F1", value: "2", puzzle: invalidPuzzleString })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");

          done();
        });
    });

    test("Check a puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ coordinate: "F1", value: "2", puzzle: toShortPuzzleString })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );

          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ coordinate: "X1", value: "2", puzzle: puzzleStrings[0][0] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");

          done();
        });
    });

    test("Check a puzzle placement with invalid placement value", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ coordinate: "E5", value: "e", puzzle: puzzleStrings[0][0] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");

          done();
        });
    });
  });

  suite("Solve", () => {
    test("Solve a puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: puzzleStrings[0][0] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, puzzleStrings[0][1]);

          done();
        });
    });

    test("Solve a puzzle with missing puzzle string", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");

          done();
        });
    });

    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: invalidPuzzleString })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");

          done();
        });
    });

    test("Check a puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: toShortPuzzleString })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );

          done();
        });
    });

    test("Solve a puzzle that cannot be solved", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: puzzleStrings[5][0] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");

          done();
        });
    });
  });
});
