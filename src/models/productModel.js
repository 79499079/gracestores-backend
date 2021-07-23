const {Schema, model} = require('mongoose');

const reviewSchema = new Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    category: { type: String, required: true },
    contenido: {type: String, required: true},
    precio: { type: Number, required: true }, 
    countInStock: { type: Number, required: true },   
    image: { type: String, required: true },
    nuevo: {type: Boolean, default: true, required: true},   
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = model('Product', productSchema)

