import pool from '../db/index.js';

export const addBook = async (req, res) => {
    const { title, author, published_year } = req.body;

    try {
    const result = await pool.query(
        "INSERT INTO books (title, author, published_year) VALUES ($1, $2, $3) RETURNING *",
        [title, author, published_year]
    );
    return res.status(201).json(result.rows[0]);
    } catch (err) {
        return res.status(500).json({ message: "error: " + err });
    }
};



 
export const deleteBook = async (req, res) => {
 const bookid = req.params.id;
    await pool.query('DELETE FROM books WHERE id=$1', [bookid]);
    return res.status(204).json({ message: 'Book deleted ' });
};



export const showBooks = async (req, res) => {
    const result = await pool.query('SELECT * FROM books');
    return res.status(200).json(result.rows);
}


export const showBookid = async (req, res) => {
    const bookid = req.params.id;
    const result = await pool.query('SELECT * FROM books WHERE id=$1', [bookid]);
    return res.status(200).json(result.rows[0]);
}


export const editBook = async (req, res) => {
    const bookid = req.params.id;
    const { title, author, published_year } = req.body;
    const result = await pool.query(
        'UPDATE books SET title=$1, author=$2, published_year=$3 WHERE id=$4 RETURNING *',
        [title, author, published_year, bookid]
    );
    return res.status(200).json(result.rows[0]);
}