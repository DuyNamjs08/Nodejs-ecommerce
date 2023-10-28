const { BadRequestErr } = require("../core/error.respone");
const {
  product,
  clothing,
  electronics,
  furniture,
} = require("../models/product.model");

// define Factory class to create product
class ProductFactoryV2 {
  static productRegister = {};
  static registerProductType(type, classRef) {
    console.log("type-classRef", type, classRef);
    ProductFactoryV2.productRegister[type] = classRef;
  }
  static async createProductFactory(type, payload) {
    const productClass = ProductFactoryV2.productRegister[type];
    console.log("productClass", productClass);
    if (!productClass) throw new BadRequestErr(`invalid product type ${type}`);
    return new productClass(payload).createProduct();
  }
}
// define base product class
class Products {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    console.log("data><????????", {
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_quantity,
      product_type,
      product_shop,
      product_attributes,
    });
  }
  async createProduct(id) {
    return await product.create({ ...this, _id: id });
  }
}
//  define sub-class for disfferent product types Clothing
class Clothings extends Products {
  async createProducts() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestErr("create new Clothing err !");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestErr("create new Product err !");
    return newProduct;
  }
}
//  define sub-class for disfferent product types Electronisc
class Electronisc extends Products {
  async createProducts() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronics)
      throw new BadRequestErr("create new Electronisc err !");
    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestErr("create new Product err !");
    return newProduct;
  }
}
class Furnitures extends Products {
  async createProducts() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestErr("create new Electronisc err !");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestErr("create new Product err !");
    return newProduct;
  }
}
ProductFactoryV2.registerProductType("Electronics", Electronisc);
ProductFactoryV2.registerProductType("Furniture", Furnitures);
ProductFactoryV2.registerProductType("Clothing", Clothings);
module.exports = ProductFactoryV2;
