const mongoose = require('mongoose')

const dbUrl = 'mongodb://localhost:27017/clothesShopDB'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

const productSchema = mongoose.Schema({
    username: String,
    password: Number,
    email: String,
    status: String
})

const usersData = mongoose.model("usersClothes", productSchema)

module.exports = usersData

module.exports.registerUser = (model, data) => {
    model.save(data)
}