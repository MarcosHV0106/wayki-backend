const express = require("express");
const router = express.Router();
const { imprimirBoletaPorId } = require("../controllers/boletaController");

// ✅ Ambos deben ser funciones
router.post("/:comandaId", imprimirBoletaPorId);

module.exports = router;
