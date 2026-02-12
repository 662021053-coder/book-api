import express from 'express'

const router = express.Router();

import {addBook, deleteBook, editBook, showBookid, showBooks } from '../controllers/bookController.js';

router.post('/', addBook);
router.get('/', showBooks);

router.get('/:id',  showBookid);
router.put('/:id', editBook);
router.delete('/:id', deleteBook);
export default router;