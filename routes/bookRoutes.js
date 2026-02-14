import express from 'express'

const router = express.Router();

import {addBook, deleteBook, editBook, showBookid, showBooks } from '../controllers/bookController.js';
import authenticateToken from '../controllers/middiewares/auth.js';
router.post('/', authenticateToken, addBook);
router.get('/', authenticateToken, showBooks);
router.get('/:id',  authenticateToken, showBookid);
router.put('/:id', authenticateToken, editBook);
router.delete('/:id', authenticateToken, deleteBook);
export default router;  