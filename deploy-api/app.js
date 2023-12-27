const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connect.js");
const res = require("./response.js");

app.use(bodyParser.json());

app.get("/", (request, response) => {
  sql = "SELECT * FROM user";
  db.query(sql, (error, result) => {
    console.log(result);
    res(200, "Berhasil Menampilkan data", result, response);
  });
});

app.get("/:id", (request, response) => {
  const id = request.params.id;
  const sql = `SELECT * FROM user WHERE id = ${id}`;
  db.query(sql, (error, result) => {
    console.log(result);
    res(200, "SUCCESS", result, response);
  });
});

app.post("/user", (request, response) => {
  const { username, password, email } = request.body;

  if (!username || !password || !email) {
    return response.status(400).send("Eror Ketika Penginputan Data!");
  }

  const sql = `INSERT INTO user (username, password, email) VALUES('${username}', '${password}', '${email}')`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log(error);
    } else if (result?.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        id: result.insertId,
      };
      response.send("BERHASIL REGISTER");
    }
  });
});

app.put("/user/:id", (request, response) => {
  const userId = request.params.id;
  const { username, password, email } = request.body;

  if (!username || !password || !email) {
    return response.status(400).send("Eror Ketika Penginputan Data!");
  }

  const sql = `UPDATE user SET username = '${username}', password = '${password}', email = '${email}' WHERE id = ${userId}`;

  db.query(sql, (error, result) => {
    if (error) {
      console.log(error);
      return response.status(500).send("Gagal memperbarui pengguna.");
    }

    if (result.affectedRows === 0) {
      return response.status(404).send("Pengguna tidak ditemukan.");
    }

    response.send("BERHASIL MEMPERBARUI");
  });
});

app.post("/login", (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).send("Eror: Harap isi semua bidang.");
  }

  const sql = `SELECT username, email, password FROM user WHERE username = '${username}' AND password = '${password}'`;

  db.query(sql, (error, results) => {
    if (error) {
      console.log(error);
      return response.status(500).send("Eror server.");
    }

    if (results.length === 1) {
      const user = results[0];
      response.send({
        username: user.username,
        email: user.email,
      });
    } else {
      response.status(401).send("Login gagal: username atau password salah.");
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
