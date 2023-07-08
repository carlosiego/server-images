const Images = require('./tables/images')
const ImgLocations = require('./tables/imglocations')
const ImgProducts = require('./tables/imgproducts')
const ImgProductsLocations = require('./tables/imgproductslocations')
const Products = require('./tables/products')


Products.sync()
ImgLocations.sync()
ImgProducts.sync()
Images.sync()
ImgProductsLocations.sync()
