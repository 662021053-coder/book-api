import e from 'express';
import db from '../db/index.js';
import pool from '../db/index.js';
import bcrypt from "bcryptjs";



import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, password ,name , tel} = req.body;

    if (!username || !password || !name || !tel) {
      return res.status(400).json({ message: "dont data" });
    }
    
    const checkUserSql = "SELECT * FROM users WHERE username = $1";
    const checkUser = await pool.query(checkUserSql, [username]);
    
    if (checkUser.rowCount > 0) {
        return res.status(400).json({ message: "Username already exists" });
    }
    //ถ้าซ้ำ
    const insertSql = 
    "INSERT INTO users (username, password, name, tel) VALUES ($1, $2, $3, $4) RETURNING *";

    const hashed_Password = await bcrypt.hash(password, 10);

    const newUser = await pool.query(insertSql, [
        username,
        hashed_Password,
        name, 
        tel
    ]);
    const user = newUser.rows[0];
    return res
        .status(201)
        .json({ message: "User registered successfully", user }); 
  } catch (error) {
    return res.status(500).json({ message: "error: " + error });
  }
};

export const login = async (req, res) => {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    try {
    const userSql = "SELECT * FROM users WHERE username = $1 LIMIT 1";
    const userResult = await pool.query(userSql, [username]);
    const user = userResult.rows[0]
    

    if (!user) {
        return res.status(400).json({ message: "user /F " });
    }
    //ทดสอบ password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(400).json({ message: " return password" });
    }
    const payload = { 
    userid: user.id, 
    username: user.username ,
    tel: user.tel
};
    const accessToken = jwt.sign
    (
        payload, process.env.Access_Token_Secret, 
        { expiresIn: "30m" });

    const refreshToken = jwt.sign
    (payload,  process.env.Refresh_Token_Secret, { 
        expiresIn: "7d" ,
    });
    return res.json({ payload, accessToken, refreshToken });

  } catch (err) {

    return res.status(500).json({ message: "err" + err });

  }
};

export const refresh = async (req, res) => {

  const { token } = req.body;

  if (!token) return res.sendStatus(401);


  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

    if (err) return res.sendStatus(403);


    const accessToken = jwt.sign(

      { userId: user.userId, username: user.username ,tel: user.tel },

      process.env.ACCESS_TOKEN_SECRET,

      { expiresIn: "30m" }

    );


    res.json({ accessToken });

  });

  
};
