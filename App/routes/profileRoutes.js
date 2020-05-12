import express from 'express';
import {getAllProfile,getProfileById, createProfile, updateProfileById, deleteProfileByID} from '../controllers/profileController'

const {body, param, check} = require('express-validator');

const router = express.Router();

// router.post('/create', createProfile);
router.get('/', getAllProfile);
router.get('/:id', getProfileById);
router.post('/update/:id', updateProfileById);
router.post('/delete/:id', deleteProfileByID);

module.exports = router;