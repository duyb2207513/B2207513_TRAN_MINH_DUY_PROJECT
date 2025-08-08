const express = require('express');
const DocGiaController = require('../controllers/docgia.controller');

const router = express.Router();

router.post('/register', DocGiaController.register);//oke

router.post('/send-otp', DocGiaController.sendOtp);//oke
router.post('/verify-otp', DocGiaController.verifyOtp);//oke
router.post('/login', DocGiaController.login); //oke
router.get('/:madocgia', DocGiaController.getOne); //oke
router.get('/', DocGiaController.getAll); //oke
router.put('/:madocgia',DocGiaController.update)//oke

module.exports = router;