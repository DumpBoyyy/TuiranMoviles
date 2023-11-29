const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); // Agrega esta línea para cargar las variables de entorno

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const app = express();
const port = 5000;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de TuiranFit');
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
  db.execute(query, [correo, contra], (err, results) => {
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
