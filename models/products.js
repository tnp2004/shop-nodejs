const mongoose = require('mongoose')

const dbUrl = 'mongodb://localhost:27017/clothesShopDB'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    picture: String
})

const Product = mongoose.model("productsClothes", productSchema)

module.exports = Product

module.exports.saveClothes = (model, data) => {
    model.save(data)
}