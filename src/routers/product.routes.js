const {Router} = require('express')
const expressAsyncHandler = require ('express-async-handler');
const Product = require ('../models/productModel');
const User = require ('../models/userModel.js');
const { isAdmin, isAuth, isSellerOrAdmin } = require ('../utils.js');

const router = Router();

router.get(
  '/product',
  expressAsyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const category = req.query.category || '';
    const idioma = req.query.idioma || '';
    const seller = req.query.seller || '';
    const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const idiomaFilter = idioma ? { idioma } : {};
    const precioFilter = min && max ? { precio: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === 'lowest'
        ? { precio: 1 }
        : order === 'highest'
        ? { precio: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };
    const count = await Product.countDocuments({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...idiomaFilter,
      ...precioFilter,
      ...ratingFilter,
    });
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...idiomaFilter,
      ...precioFilter,
      ...ratingFilter,   
    })
      .populate('seller', 'seller.name seller.logo')
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

router.get(
  '/product/category',
  expressAsyncHandler(async (req, res) => {
    const categorys = await Product.find().distinct('category');
    res.send(categorys);
  })
);

router.get(
  '/product/idioma',
  expressAsyncHandler(async (req, res) => {
    const categorys = await Product.find().distinct('idioma');
    res.send(categorys);
  })
);

router.get(
  '/product/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

router.post(
  '/product',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: req.body.name,
      descripcion: req.body.descripcion,
      category: req.body.category,
      contenido: req.body.contenido,
      precio: req.body.precio,
      countInStock: req.body.countInStock,
      image: req.body.image,
      rating: 0,
      numReviews: 0,      
    });
    const createdProduct = await product.save();
    res.send({ message: 'Pelicula Creada', product: createdProduct });
  })
);

router.put(
  '/product/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.actores = req.body.actores;
      product.argumento = req.body.argumento;
      product.category = req.body.category;
      product.calidad = req.body.calidad;
      product.idioma = req.body.idioma;
      product.year = req.body.year;
      product.precio = req.body.precio;
      product.countInStock = req.body.countInStock;
      product.image = req.body.image;
      product.nuevo = req.body.nuevo;     
      const updatedProduct = await product.save();
      res.send({ message: 'Producto Modificado', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Producto no existe' });
    }
  })
);

router.delete(
  '/product/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

router.post(
  '/product/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'Ya enviaste una crítica' });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

router.get(
  "/listaProductos",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.find()
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Producto No Existe" });
    }
  })
);

module.exports = router;
