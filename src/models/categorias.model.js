const {Schema, model} = require('mongoose');

const categoriaSchema = new Schema({    
    nombre: {type: String, required: true, unique: true},  
    imagen: {type: String, required: true}, 
    producto: { type: Schema.Types.ObjectID, ref: 'Producto' },
}, {
    timestamps: true,
    versionKey: false
})

module.exports = model('Categoria', categoriaSchema)