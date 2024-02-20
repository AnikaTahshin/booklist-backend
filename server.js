import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { compareHash, genHash } from "./utils/bcrypt.js";
import db from "./config/db.config.js";
import { generateAccessToken } from "./utils/jwt.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;

    const sql1 = "SELECT * FROM users WHERE email = ?";
    const sqlRresponse1 = await db.query(sql1, [email]);
    const user = sqlRresponse1[0];
    if (user) {
      res.status(409).send({ status: 409, message: "User already exist." });
      return;
    }
    const hashPass = genHash(req.body.password);
    const sql2 = "INSERT INTO users (`name`,`email`,`password`) VALUES(?,?,?)";
    const result = await db.query(sql2, [name, email, hashPass]);
    console.log("res", result);
    res.send({
      status: 201,
      message: "User Created Successfully",
      data: result.values,
    });
  } catch (error) {
    console.log("server error", error);
    return;
  }
});

app.post('/login', async (req, res) => {
  try {
      const email = req.body.email;
      const password = req.body.password;
      const sql = "SELECT * FROM users WHERE email = ?";
      const sqlRresponse = await db.query(sql, [email]);
      const user = sqlRresponse[0];

      if (!user) {
          res.status(404).send({ status: 404, message: "User not found." });
          return;
      }

      const sql2 = "SELECT * FROM userDevice WHERE user_id = ?"
      const deviceList = await db.query(sql2, [user.id]);

      const deviceExist = deviceList.some((el) => (el.device_name == req.body.deviceName));

      if (!deviceExist && deviceList.length >= 2) {
          res.status(400).send({ status: 400, message: "Max device login exceed." });
          return;
      }
      if (!deviceExist) {
          const sql2 = "INSERT INTO userDevice (user_id, device_name) VALUES (?, ?);"
          const newDevice = await db.query(sql2, [user.id, req.body.deviceName]);
      }

      const comparePassHash = compareHash(password, user.password);

      if (!comparePassHash) {
          res.status(400).send({ status: 400, message: "Wrong password!" });
          return;
      }
      const jwtPayload = {
          id: user.id,
          name: user.name,
          email: user.email,
      };

      const jwtAccessToken = generateAccessToken(jwtPayload);

      res.status(200).send({
          status: 200,
          message: "Successfully Login!",
          user: user,
          token: jwtAccessToken,
      });
  } catch (error) {
      return;
  }
})

app.get("/books", async (req, res) => {
  try {
    const sql = "SELECT * FROM books";
    const sqlRresponse = await db.query(sql);
    console.log('first',sqlRresponse)
    res
      .status(200)
      .send({
        status: 200,
        message: "Data Fetched Successfully",
        data: sqlRresponse,
      });
    return;
  } catch (error) {}
});

app.get("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "SELECT * FROM books WHERE id=?";
    const sqlRresponse = await db.query(sql,[id]);

    if (!sqlRresponse) {
      res.status(404).send({ status: 404, message: "Data not found." });
    }
    
    res
      .status(200)
      .send({
        status: 200,
        message: "Data Fetched Successfully",
        data: sqlRresponse,
      });
    return;
  } catch (error) {}
});

app.listen(8081, () => {
  console.log("Server is running on port:" + 8081);
});
