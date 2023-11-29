const express = require('express');
const mysql = require('mysql2');  // Cambiado a mysql2
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'juannn',
  database: 'tuiranfitxx',
});

app.use(cors());
app.use(bodyParser.json());

app.get('/productos', (req, res) => {
  const query = 'SELECT * FROM productos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta de productos:', err);
      res.status(500).send('Error al consultar la base de datos');
    } else {
      res.json(results);
    }
  });
});

app.get('/users', (req, res) => {
  const query = 'SELECT * FROM usuarios';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta de usuarios:', err);
      res.status(500).send('Error al consultar la base de datos');
    } else {
      res.json(results);
    }
  });
});

const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
  console.log('Recibida solicitud de inicio de sesión');
  const { correo, contra } = req.body;

  const query = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';
  db.execute(query, [correo, contra], (err, results) => {  // Cambiado a db.execute
    if (err) {
      console.error('Error en la consulta de inicio de sesión:', err);
      return res.status(500).send('Error al consultar la base de datos.');
    }

    if (results.length === 0) {
      return res.status(401).send('Credenciales incorrectas.');
    }

    const usuario = { correo, contra };
    const token = jwt.sign(usuario, 'tu_secreto');
    res.json({ token });
  });
});

process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa no manejada:', promise, 'Motivo:', reason);
});

app.listen(port, () => {
  console.log(`Servidor API lanzado en el puerto ${port}`);
});
