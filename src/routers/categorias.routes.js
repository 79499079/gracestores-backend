const { Router } = require("express");
const expressAsyncHandler = require("express-async-handler");
const { isAdmin, isAuth } = require("../utils");

const Categoria = require("../models/categorias.model");/* 
const Producto = require("../models/productModel"); */

const router = Router();

router.post(
  "/crearCategorias" /* 
  isAdmin,
  isAuth, */,
  expressAsyncHandler(async (req, res) => {
    const categoria = new Categoria({
      nombre: req.body.nombre,
      imagen: req.body.imagen,
    });
    const creaCategoria = await categoria.save();
    res.send({ message: "Categoria Creado", categoria: creaCategoria });
  })
);

router.get(
  "/listaCategorias" /* 
  isAdmin,
  isAuth, */,
  expressAsyncHandler(async (req, res) => {
    /* /Almuerzo/ ==> busca si contiene la palabra Almuerzo */
    /* /^Almuerzo/ ==> busca si comienza con la palabra Almuerzo */
    /** /d$/ palabra que acaben en d: */
    const categoria = await Categoria.find({nombre:/Almuerzo/}).sort({ nombre: "asc" });
    res.send(categoria);
  })
);

router.get(
  "/listaCategoriaAdicion" /* 
  isAdmin,
  isAuth, */,
  expressAsyncHandler(async (req, res) => {    
    /* $nin busca la palabra que contenga almuerzo y la elimina de la busqueda */
    const categoria = await Categoria.find({nombre:{$nin:/Almuerzo/}});
    res.send(categoria);
  })
);

router.get(
  "/listaCategoriaGral" /* 
  isAdmin,
  isAuth, */,
  expressAsyncHandler(async (req, res) => {    
    const categoria = await Categoria.find().sort({ nombre: "asc" });
    res.send(categoria);
  })
);

router.get(
  "/listaCategoriaProducto/:id",
  expressAsyncHandler(async (req, res) => {
    const categorias = await Categoria.find({_id: req.params.id}).distinct("nombre")
    const producto = await Producto.find({categoria: categorias})
    res.send(producto);
  })
);

router.delete(
  "/categoria/:id" /* 
  isAdmin,
  isAuth, */,
  expressAsyncHandler(async (req, res) => {
    const categoria = await Categoria.findById(req.params.id);
    if (categoria) {
      const deleteCategoria = await categoria.remove();
      res.send({ message: "Categoria Borrado", categoria: deleteCategoria });
    } else {
      res.status(404).send({ message: "Categoria No Existe" });
    }
  })
);

module.exports = router;
