const shopModel = require("../models/shop.model");

const findByEmail = async ({
  email,
  select = {
    name: 1,
    password: 2,
    email: 1,
    status: 1,
    roles: 1,
  },
}) => {
  const newLocal = "email>>???";
  console.log(newLocal, email);
  return shopModel.findOne({ email }).select(select).lean();
};
module.exports = {
  findByEmail,
};
