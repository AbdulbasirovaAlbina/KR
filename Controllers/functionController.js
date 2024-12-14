
const { parse } = require("dotenv");
const pool = require("../db");
const queries = require("../queries");

const func_SelectCooperator = (req, res) => {
  const { surname, name, birthday } = req.body;
  pool.query(
    queries.func_SelectCooperator,
    [surname, name, birthday],
    (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows);
    }
  );
};

const func_CountCooperator = (req, res) => {
  const name_department = req.params.name_department; 
  pool.query(queries.func_CountCooperator, [name_department], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const func_InsertCooperator = (req, res) => {
  const {surname, name, birthday} = req.body;
  pool.query(
    queries.func_InsertCooperator,
    [surname, name, birthday],
    (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows);
    }
  );
};

module.exports = {
  func_SelectCooperator,
  func_CountCooperator,
  func_InsertCooperator,
};