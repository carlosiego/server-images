const Products = require('./tables/products')
const ImgLocations = require('./tables/imglocations')
const ImgProducts = require('./tables/imgproducts')
const VideosProducts = require('./tables/videosproducts')


Products.sync()
ImgLocations.sync()
ImgProducts.sync()
VideosProducts.sync()


Products.belongsTo(ImgProducts, { foreignKey: 'imgprod_id'});
Products.belongsTo(ImgLocations, { foreignKey: 'imgloc_id'});
Products.belongsTo(VideosProducts, { foreignKey: 'video_id'});
