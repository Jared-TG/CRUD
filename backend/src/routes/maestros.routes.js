const express = require("express");
const router = express.Router();
const maestrosController = require("../controllers/maestros.controller");

router.get('/', maestrosController.getMaestros);
router.get('/:id', maestrosController.getMaestroById);
router.post('/', maestrosController.createMaestro);
router.put('/:id', maestrosController.updateMaestro);
router.delete('/:id', maestrosController.deleteMaestro);

module.exports = router;
