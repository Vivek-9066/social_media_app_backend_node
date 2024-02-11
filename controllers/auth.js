import { db } from "../connect.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("user already exists..");

    const saltRounds=10;
    const typedPassword = req.body.password;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(typedPassword, salt);

    const q =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)"
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ]

    db.query(q, [values], (err, data) => {
      return res.status(200).json("User has been Created Successfully!");
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if(err) {
      return res.status(500).json(err)
    }
    else if(data.length === 0){
      return res.status(404).json("User not Found!");
    }

    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)
    if (!checkPassword) {
      return res.status(400).json("Wrong Password!")
    }

    const token = jsonwebtoken.sign({ id: data[0].id }, "secretkey")
    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("user has been logged out");
};
