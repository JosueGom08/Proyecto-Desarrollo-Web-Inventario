require("dotenv").config();
const express = require("express");
const cors = require("cors");
// control de imagenes subidas
// Cloudinary es una nube para subir fotos
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const mysql = require("./db");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// credenciales de Cloudinary (importantes para poder guardar y transformar las fotos subidas)
cloudinary.config({
  cloud_name: process.env.KEYNAME,
  api_key: process.env.APIKEYCLOUD,
  api_secret: process.env.APISECRETCLOUD,
});

// para mantener la imagen en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// obtener todos los usuarios
app.get("/users", async (req, res) => {
  const [users] = await mysql.query(
    "SELECT CAST(id as CHAR) as id, name, role, password, email FROM User",
  );

  if (users) {
    // se encontraron
    res.status(200).json(users);
  } else {
    res.status(500).json({
      message: "no se pudo obtener la lista de usuarios completa",
    });
  }
});

// encontrar usuario
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  // verifica el id (UUID)
  if (id.length > 36 || typeof id !== "string") {
    return res.status(404).json({ message: "ocurrio un error en el id" });
  }

  try {
    // ejecuta la obtencion del dato con el id ingresado
    const [user] = await mysql.execute(
      "SELECT CAST(id AS CHAR) AS id, name, role FROM User WHERE id = ?",
      [id],
    );

    // si obtuvo aunque sea un dato, significa que ocurrio con normalidad
    if (user.length > 0) {
      // extraemos el objeto de la lista recibida
      const userFound = user[0];
      // devolvemos el usuario
      res.status(200).json(userFound);
    } else {
      res.status(404).json({
        message: "Usuario no encontrado, comprobar si el id es correcto",
      });
    }
  } catch (error) {
    // ocurrio un error durante el proceso de obtencio nde usuario
    console.log(error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

// registro de usuarios
app.post("/users", async (req, res) => {
  const { name, password, email } = req.body;

  try {
    if (!name || typeof name !== "string") {
      return res.status(404).json({ messgae: "error en el nombre" });
    }

    if (!password || typeof password !== "string") {
      return res.status(404).json({ messgae: "error en la contraseña" });
    }

    if (!email || typeof email !== "string") {
      return res
        .status(404)
        .json({ messgae: "error en el correo electronico" });
    }

    await mysql.execute(
      "INSERT INTO User (name, password, role, email) VALUES (?,?,'consultor',?)",
      [name, password, email],
    );

    res.status(200).json({ message: "Usuario correctamente insertado!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "error en durante el registro de nuevo usuario" });
  }
});

// verificacion de Usuario (login)
app.post("/verifyUser", async (req, res) => {
  const { name, password } = req.body;

  // verifica el nombre y si cumple con los estandares
  if (
    !name ||
    name.length < 0 ||
    !typeof name == "string" ||
    name.trim().length === 0
  ) {
    return res.status(404).json({ message: "error en el nombre de usuario" });
  }

  // verifica que la contrasena cumpla con los estandares
  if (
    !password ||
    password.length < 0 ||
    !typeof password == "string" ||
    password.length === 0
  ) {
    return res
      .status(404)
      .json({ message: "error en la contraseña de usuario" });
  }

  // si no hubo problema
  try {
    // verifica si existe una coincidencia en la base de datos
    const [rows] = await mysql.execute(
      "SELECT CAST(id AS CHAR) AS id, name, role FROM User WHERE name = ? AND password = ?",
      [name, password],
    );

    // si la hay, significa que el usuario ya fue registrado y puede acceder a la aplicacion web
    if (rows.length > 0) {
      const currentUser = {
        id: rows[0].id,
        name: rows[0].name,
        role: rows[0].role,
      };
      // si encontro al usuario
      res.status(200).json(currentUser);
    } else {
      // si no encontro al usuario
      res.status(404).json({ message: "Usuario no registrado" });
    }
  } catch (error) {
    // ocurrio un error en el proceso de verificacion
    console.log(error);
    res.status(500).json({ message: "Error al intentar validar usuario" });
  }
});

// obtener los elementos en el inventario
app.get("/elements", async (req, res) => {
  try {
    // ejecuta la seleccion de todos los elementos en base de datos
    const [elements] = await mysql.execute(
      `SELECT 
        Element.id as id, 
        Element.name as name,
        Element.description as description,
        Element.quantity as quantity, 
        Element.img as img,
        Element.entryDate as entryDate,
        Category.category as category, 
        Category.type as type
    FROM Element 
    JOIN Category ON Element.categoryId = Category.id`,
    );
    // verifica la cantidad de elementos en la lista
    if (elements.length > 0) {
      // si es mas de cero significa que logro obtener los datos
      res.status(200).json(elements);
    } else {
      // de lo contrario no retorno nada y envia un error
      res
        .status(500)
        .json("ocurrio un error al intentar obtener los elementos");
    }
  } catch (error) {
    // si ocurrio algun problema en el proceso de obtencion de todos los datos
    console.log(error);
    res
      .status(500)
      .json({ message: "ocurrio un error al intentar obtener los elementos" });
  }
});

// obtener los elementos por categoria
app.get("/elementsC/:category", async (req, res) => {
  const { category } = req.params;

  // verifica la categoria
  if (!category || category.length < 0 || !typeof category == "string") {
    return res
      .status(404)
      .json({ message: "ocurrio un error con la categoria" });
  }
  try {
    // extrae todos los elementos de la misma categoria
    const [elementsbyCategory] = await mysql.execute(
      `SELECT
        Element.id,
        Element.name AS Producto,
        Element.description AS Descripcion,
        Element.quantity AS Cantidad,
        Element.img as Imagen,
        Category.category AS Categoria,
        Category.type AS Tipo
    FROM Element
    JOIN Category ON Element.categoryId = Category.id
    WHERE Category.category = ?`,
      [category],
    );

    // si la lista que retorno no tiene elementos, significa que no existe la categoria
    if (elementsbyCategory.length > 0) {
      // si tiene elementos retorna los elementos con dicha categoria
      res.status(200).json(elementsbyCategory);
    } else {
      res.status(404).json({ message: "la categoria no existe" });
    }
  } catch (error) {
    // ocurrio un error en algun punto de la obtencion de datos
    console.log(error);
    res.status(500).json({
      message:
        "ocurrio un error al cargar los elementos de la categoria: " + category,
      error: error,
    });
  }
});

// obtencion de elementos por id
app.get("/elements/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || typeof Number(id) != "number" || Number(id) < 0) {
      return res.status(404).json({ message: "ocurrio un error en el id" });
    }

    const [element] = await mysql.execute(
      `SELECT 
        Element.id, 
        Element.name AS name,
        Element.description AS description,
        Element.quantity AS quantity, 
        Element.img as img,
        Element.entryDate as entryDate,
        Category.category AS category, 
        Category.type AS type
    FROM Element 
    JOIN Category ON Element.categoryId = Category.id 
    WHERE Element.id = ?`,
      [id],
    );

    if (element.length > 0) {
      res.status(200).json(element[0]);
    } else {
      res
        .status(404)
        .json({ message: "No se pudo encontrar al elemento solicitado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error al intentar buscar elemento por id",
    });
  }
});

// agregar elemento (completamente nuevo)
app.post("/elements", upload.single("img"), async (req, res) => {
  const { name, description, quantity, category, type } = req.body;

  try {
    // Validar presencia de la imagen
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha subido ninguna imagen" });
    }

    // Convertir y validar cantidad
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({
        message:
          "Error en la cantidad del producto (debe ser un número mayor o igual a 0)",
      });
    }

    // Validar campos de texto requeridos
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ message: "Error en el nombre del producto" });
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Error en la descripción del producto" });
    }

    if (!category || typeof category !== "string" || category.trim() === "") {
      return res
        .status(400)
        .json({ message: "Error en la categoría del producto" });
    }

    if (!type || typeof type !== "string" || type.trim() === "") {
      return res.status(400).json({ message: "Error en el tipo del producto" });
    }

    // Validar si la categoría existe en el sistema
    const categoryId = findCategory(category);
    if (categoryId === null || categoryId === undefined) {
      return res
        .status(400)
        .json({ message: "La categoría especificada no existe" });
    }

    // Convertir imagen a Base64 y subir a Cloudinary
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // envio de la imagen a cloudinary
    const uploadResult = await cloudinary.uploader.upload(fileBase64, {
      folder: "Inventario",
    });

    // obtencion de resultado (ok = se ingreso la imagen y retorna una url para guardar a la base de datos || no ok = no logro ingresar la imagen)
    const imageUrl = uploadResult.secure_url;
    // si no logra enviar la imagen entonces retorna un error
    if (!imageUrl) {
      return res
        .status(500)
        .json({ message: "Error al cargar la imagen a Cloudinary" });
    }

    // Formatear fecha e insertar en MySQL
    // const today = new Date().toISOString().split("T")[0];
    const today = new Date();

    // inserta los datos en la base de datos
    const [elementResult] = await mysql.execute(
      "INSERT INTO Element (name, quantity, description, entryDate, img, categoryId) VALUES (?, ?, ?, ?, ?, ?)",
      [name, parsedQuantity, description, today, imageUrl, categoryId],
    );

    // luego hacemos el insert
    await mysql.execute(
      `
        INSERT INTO Movements (Type, lastModification, newModification, elementId, description) 
        VALUES ('INSERT', NULL, ?, ?, 'Inserción'
        )
        `,
      [today, elementResult.insertId],
    );

    // Respuesta exitosa
    return res.status(201).json({
      name,
      description,
      quantity: parsedQuantity,
      category,
      type,
    });
  } catch (error) {
    // ocurrio un error en alguna parte del proceso de inserccion
    console.error(error);
    return res
      .status(500)
      .json({ message: "ocurrio un error al intentar ingresar un producto" });
  }
});

// agregar elemento existente (cantidad en existencias)
// agrega o elimina elementos existentes (solo modifica la cantidad en existencias)
app.put("/elementsQuantity/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity, type } = req.body;

  try {
    // const today = new Date().toISOString().split("T")[0];
    const today = new Date();
    const numid = Number(id);
    const numquantity = Number(quantity);
    if (
      !type ||
      typeof type !== "string" ||
      !["INSERT", "DELETE"].includes(type)
    ) {
      return res.status(400).json({ message: "error en el tipo" });
    }

    if (!id || isNaN(numid) || numid <= 0) {
      return res.status(400).json({ message: "error en el id" });
    }

    if (!quantity || isNaN(numquantity) || numid <= 0) {
      return res.status(400).json({ message: "error en la cantidad" });
    }

    // obtenemos la cantidad inicial
    const [quantityValue] = await mysql.execute(
      `
        SELECT quantity FROM Element WHERE id = ?
      `,
      [numid],
    );

    // nos aseguramos que si haya encontrado algo
    if (quantityValue.length === 0) {
      return res.status(404).json({
        message:
          "El 'id' ingresado no pertenece a ningun elemento en base de datos",
      });
    }
    // si no hubo problema
    // declaramos una variable la cual sera el total a actualizar
    let newQuantity = 0;
    let description = "";
    // si el tipo es 'INSERT', entonces significa que sumara
    if (type === "INSERT") {
      // sumamos la cantidad
      newQuantity = Number(quantityValue[0].quantity) + numquantity;
      description = "Aumento de número de existencias";
    } else {
      // de lo contrario restara
      newQuantity = Number(quantityValue[0].quantity) - numquantity;
      description = "Disminución de número de existencias";
    }

    // iniciamos la actualizacion
    const [rows] = await mysql.execute(
      `
        UPDATE Element SET quantity = ? WHERE id = ?
      `,
      [newQuantity, id],
    );

    // verificamos que se haya modificado algo
    if (rows.changedRows !== 0) {
      // obtenemos la fecha a la insercion inicial o la ultima vez que se agrego un elemento a la existencia
      const [lastMove] = await mysql.execute(
        `SELECT newModification FROM Movements WHERE elementId = ? ORDER BY newModification DESC LIMIT 1`,
        [id],
      );
      // nos aseguramos que haya encontrado algo, si no (caso extraño), retornara nulo
      const lastModification =
        lastMove.length > 0 ? lastMove[0].newModification : null;

      await mysql.execute(
        `
        INSERT INTO Movements (Type, lastModification, newModification, elementId, description) 
        VALUES (?,?,?,?,?)
        `,
        [type, lastModification, today, id, description],
      );

      if (type === "INSERT") {
        return res
          .status(200)
          .json({ message: "Elemento(s) agregado correctamente" });
      } else {
        return res
          .status(200)
          .json({ message: "Elemento(s) eliminado correctamente" });
      }
    } else {
      return res.status(404).json({
        message:
          "El 'id' ingresado no pertenece a ningun elemento en base de datos",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error al intentar agregar elemento" });
  }
});

// actualizacion de elementos (actualizacion completa)
app.put("/elements/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, category } = req.body;

  try {
    // const today = new Date().toISOString().split("T")[0];
    const today = new Date();
    // Convertir y validar cantidad
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({
        message:
          "Error en la cantidad del producto (debe ser un número mayor o igual a 0)",
      });
    }

    // Validar campos de texto requeridos
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ message: "Error en el nombre del producto" });
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Error en la descripción del producto" });
    }

    if (!category || typeof category !== "string" || category.trim() === "") {
      return res
        .status(400)
        .json({ message: "Error en la categoría del producto" });
    }

    // Validar si la categoría existe en el sistema
    const categoryId = findCategory(category);
    if (categoryId === null || categoryId === undefined) {
      return res
        .status(400)
        .json({ message: "La categoría especificada no existe" });
    }

    // actualiza al elemento
    const [updateResult] = await mysql.execute(
      "UPDATE Element SET name=?, description=?, quantity=?, categoryId=? WHERE id=?",
      [name, description, parsedQuantity, categoryId, id],
    );

    if (updateResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "El elemento especificado no existe" });
    }

    const [lastMove] = await mysql.execute(
      `SELECT newModification FROM Movements WHERE elementId = ? ORDER BY newModification DESC LIMIT 1`,
      [id],
    );
    // nos aseguramos que haya encontrado algo, si no (caso extraño), retornara nulo
    const lastModification =
      lastMove.length > 0 ? lastMove[0].newModification : null;

    console.log(lastModification, today);
    // luego hacemos el insert
    await mysql.execute(
      `
          INSERT INTO Movements (Type, lastModification, newModification, elementId, description) 
          VALUES ('UPDATE',?,?,?, 'Actualización')
        `,
      [lastModification, today, id],
    );

    return res.status(200).json({
      message: "Elemento actualizado correctamente",
      element: {
        id: id,
        name: name,
        description: description,
        quantity: parsedQuantity,
        category: category,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "ocurrio un error durante la actualizacion del elemento",
    });
  }
});

// eliminar elemento (eliminacion completa de la base de datos)
app.delete("/elements/:id", async (req, res) => {
  const { id } = req.params;
  // verifica que sea un id valido
  if (!id || Number(id) <= 0) {
    return res.status(404).json({ message: "ocurrio un erro con el id" });
  }

  try {
    // const today = new Date().toISOString().split("T")[0];
    const today = new Date();
    const [lastMove] = await mysql.execute(
      `SELECT newModification FROM Movements WHERE elementId = ? ORDER BY newModification DESC LIMIT 1`,
      [id],
    );

    const lastModification =
      lastMove.length > 0 ? lastMove[0].newModification : null;

    // luego hacemos el insert
    await mysql.execute(
      `
          INSERT INTO Movements (Type, lastModification, newModification, elementId, description) 
          VALUES ('DELETE',?,?,?, 'Eliminación Permanente')
        `,
      [lastModification, today, id],
    );

    // elimina el elemento en base al id
    const [deleteElement] = await mysql.execute(
      "DELETE FROM Element WHERE id = ?",
      [id],
    );
    // si alguna fila fue afectada entonces significa que lo elimino
    if (deleteElement.affectedRows !== 0) {
      return res.status(200).json({
        message: "elemento correctamente eliminado",
        element: {
          id: id,
        },
      });
    } else {
      // si no logro eliminar ninguna
      return res
        .status(404)
        .json({ message: "ocurrio un error al eliminar el elemento" });
    }
  } catch (error) {
    // ocurrio un error en el proceso de eliminacion
    console.log(error);
    return res
      .status(500)
      .json({ message: "ocurrio un error al eliminar el elemento" });
  }
});

// eliminar de existencias elemento existente
// app.put("/elementsDelete/:id", async (req, res) => {
//   const { id } = req.params;
//   const { quantity } = req.body;

//   try {
//     const today = new Date().toISOString().split("T")[0];

//     if (!id || Number(id) <= 0) {
//       return res.status(404).json({ message: "error en el id" });
//     }

//     if (!quantity || Number(quantity) <= 0) {
//       return res.status(404).json({ message: "error en la cantidad" });
//     }

//     const [rows] = await mysql.execute(
//       `
//         UPDATE Element SET quantity = ? WHERE id = ?
//       `,
//       [quantity, id],
//     );

//     // verificamos que se haya modificado algo
//     if (rows.affectedRows !== 0) {
//       // obtenemos la fecha a la insercion inicial o la ultima vez que se agrego un elemento a la existencia
//       const [lastMove] = await mysql.execute(
//         `SELECT newModification FROM Movements WHERE elementId = ? ORDER BY newModification DESC LIMIT 1`,
//         [id],
//       );
//       // nos aseguramos que haya encontrado algo, si no (caso extraño), retornara nulo
//       const lastModification =
//         lastMove.length > 0 ? lastMove[0].newModification : null;

//       await mysql.execute(
//         `
//         INSERT INTO Movements (Type, lastModification, newModification, elementId)
//         VALUES ('DELETE',?,?,?)
//         `,
//         [lastModification, today, id],
//       );

//       return res
//         .status(200)
//         .json({ message: "Elemento(s) agregado correctamente" });
//     } else {
//       return res.status(404).json({
//         message:
//           "El 'id' ingresado no pertenece a ningun elemento en base de datos",
//       });
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "error al intentar agregar elemento" });
//   }
// });

// retorna todos los movimientos
app.get("/moveAll", async (req, res) => {
  try {
    const [rows] = await mysql.execute(
      `
      SELECT
        m.id AS id,
        m.Type AS type, 
        COALESCE(e.name, 'Elemento Eliminado') AS name,
        m.elementId AS elementId,
        e.quantity AS quantity, 
        m.lastModification AS lastModification, 
        m.newModification AS newModification,
        m.description AS description
      FROM Movements m
      LEFT JOIN Element e ON m.elementId = e.id
      ORDER BY m.newModification DESC
      `,
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener los movimientos",
      error: error.message,
    });
  }
});

// funcion para traducir de texto a id de categoria
function findCategory(category) {
  switch (category) {
    case "Computadora":
      return 1;
    case "Teléfono":
      return 2;
    case "Mesa":
      return 3;
    case "Periféricos":
      return 4;
    case "Sillas":
      return 5;
    default:
      null;
  }
}

app.listen(process.env.APIPORT, () => {
  console.log("http://localhost:3000");
});
