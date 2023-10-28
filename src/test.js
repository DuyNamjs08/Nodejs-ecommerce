// var fibGenerator = function (x) {
//   if (x === 0) return [];
//   const arr = Array(5);
//   console.log(arr);
// };

const { BadRequestErr } = require("./core/error.respone");
const { furniture, product } = require("./models/product.model");

// fibGenerator(5);
const createProducts = async (type, payload) => {
  const funcTotal = exactCall.filter((el) => el.type === type)[0].component;
  return await funcTotal(payload);
};
const exactCall = [
  { type: "Furniture", component: createNewFurniture },
  { type: "Clothing", component: createNewFurniture },
  { type: "Electronics", component: createNewFurniture },
];
const createNewFurniture = async (payload) => {
  const newFurniture = await furniture.create({
    ...payload.product_attributes,
    product_shop: payload.product_shop,
  });
  if (!newFurniture) throw new BadRequestErr("create new Electronisc err !");
  const newProduct = await createProduct(payload, newFurniture._id);
  if (!newProduct) throw new BadRequestErr("create new Product err !");
  return newProduct;
};
const createProduct = async (payload, id) => {
  return await product.create({ ...payload, _id: id });
};
