import express from "express";
import db from "./utils/database.js";
import User from "./models/users.model.js";
import "dotenv/config";

User;

const PORT = process.env.PORT ?? 8000;

db.authenticate()
  .then(() => {console.log("Conexión correcta")})
  .catch((err) => console.error(err))

  // para modificar la tabla => sync({alter: true})
db.sync() // si no existe la tabla => la crea / si ya existe no hace nada
  .then(() => console.log("Base de datos sincronizada"))
  .catch((err) => console.error(err))

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ok");
});

// CREATE user
// Cuando se haga una request a /users POST crea un usuario

app.post('/users', async (req, res) => {
  try {
    const { body } = req;
    // mandar esta info a la base de datos
    // INSERT INTO users (username, email, password) 
    const user = await User.create(body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// READ users
// GET /users => devolver un json con todos los usuarios en la db
// SELECT * FROM users;
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(400).json(error);
  }
});

// SELECT * FROM users WHERE id=4;
// GET /users/:id
// ? como mandamos el id en este get
// path params

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.json(user); // params es un objeto
  } catch (error) {
    res.status(400).json(error);
  }
});

// UPDATE ..... WHERE id=5;
// PUT '/users' => path params
// la información a actualizar por el body

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    // primer objeto es la info
    // segundo objeto es el where
    const user = await User.update(body, {
      where: { id } // => { id:id }
    });
    res.status(204).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    await User.destroy({
      where: { id }
    });
    res.status(204).end()
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
});