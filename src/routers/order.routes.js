const { Router } = require("express");
const expressAsyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const { isAdmin, isAuth, isSellerOrAdmin } = require("../utils");

const router = Router();

router.get(
  "/order",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || "";
    const sellerFilter = seller ? { seller } : {};

    const orders = await Order.find({ ...sellerFilter })
      .populate("user", "name")
      .sort({
        createdAt: "desc",
      });
    res.send(orders);
  })
);

router.get(
  "/order/pendientesEnvio",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || "";
    const sellerFilter = seller ? { seller } : {};
    const pendientes = { isDelivered: false };

    const orders = await Order.find({ ...sellerFilter, ...pendientes })
      .populate("user", "name")
      .sort({
        createdAt: "desc",
      });
    res.send(orders);
  })
);

router.get(
  "/order/CuentaPendientesEnvio",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const pendientes = { isDelivered: false };
    const count = await Order.countDocuments({...pendientes});
    res.send({ cuenta: count });
  })
);

router.get(
  "/order/pendientesPago",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || "";
    const sellerFilter = seller ? { seller } : {};
    const pendientes = { isPaid: false };

    const orders = await Order.find({ ...sellerFilter, ...pendientes })
      .populate("user", "name")
      .sort({
        createdAt: "desc",
      });
    res.send(orders);
  })
);

router.get(
  "/order/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: "desc",
    });
    res.send(orders);
  })
);

router.post(
  "/order",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "Carrito está vacio" });
    } else {
      const accountSid = process.env.ACCOUNT_SID;
      const authToken = process.env.AUTH_TOKEN;
      const client = require("twilio")(accountSid, authToken);
      client.messages
        .create({
          to: process.env.MI_NUMERO_CELULAR,
          from: process.env.ENVIA_NUMERO_CELULAR,
          body: "Se ha pedido una pelicula, por favor verifique en su tienda",
        })
        .then((message) => console.log(message.sid))
        .catch((error) => console.log(error));

      const order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrecio: req.body.itemsPrecio,
        shippingPrecio: req.body.shippingPrecio,
        taxPrecio: req.body.taxPrecio,
        descuento: req.body.descuento,
        totalPrecio: req.body.totalPrecio,
        user: req.user._id,
        seller: req.body.orderItems[0].seller,
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: "New Order Created", order: createdOrder });
    }
  })
);

router.get(
  "/order/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

router.delete(
  "/order/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: "Order Deleted", order: deleteOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

router.put(
  "/order/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const payOrder = await order.save();
      res.send({ message: "Orden ha sido Pagada", order: payOrder });
    } else {
      res.status(404).send({ message: "Orden no existe" });
    }
  })
);

router.put(
  "/order/:id/deliver",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.send({ message: "Orden ha sido Entregada", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order no Existe" });
    }
  })
);

module.exports = router;
