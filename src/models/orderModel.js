const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        precio: { type: Number, required: true },
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      barrio: { type: String, required: true },      
      whatsapp: { type: String, required: false },
      lat: Number,
      lng: Number,
    },
    paymentMethod: { type: String, required: true },    
    itemsPrecio: { type: Number, required: true },
    shippingPrecio: { type: Number, required: true },
    taxPrecio: { type: Number, required: true },
    descuento: { type: Number, required: true },
    totalPrecio: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectID, ref: 'User' },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Order", orderSchema);