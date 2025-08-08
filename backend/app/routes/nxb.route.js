const express = require('express');
const router = express.Router();
const NXBController = require('../controllers/nxb.controller');

router
  .route('/')
  .get(NXBController.getAll) // OKE
  .post(NXBController.createNXB); // OKE

router
  .route('/:maNXB')
  .get(NXBController.getNXB) // OKE
  .put(NXBController.updateNXB) // OKE
  .delete(NXBController.deleteNXB); // OKE

module.exports = router;