const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/auth");
const { getInforData } = require("../utils");
const {
  BadRequestErr,
  ConflictRequestError,
  AuthFailure,
} = require("../core/error.respone");
const { findByEmail } = require("./shoplogin.service");
const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
check token used
*/
  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKey(userId);
      throw new ConflictRequestError("1 soos loi ow day , pls relogin");
    }
    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailure("shop chua dang ki");
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailure("shop chua dang ki 2");
    // tao 1 cap token  moi
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user,
      tokens,
    };
  };
  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    console.log("refreshToken>>>>", refreshToken);
    if (foundToken) {
      // decode xem may la thang nao
      const { email, userId } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log("tesstt", { userId, email });
      // xoa tat ca token trong keyStore
      await KeyTokenService.deleteKey(userId);
      throw new ConflictRequestError("1 soos loi ow day , pls relogin");
    }
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailure("shop chua dang ki");
    const { email, userId } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("[2]---", { email, userId });
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailure("shop chua dang ki");
    // tao 1 cap token  moi
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };
  static logOut = async (keyStore) => {
    // console.log("keyStore", keyStore);
    const result = await KeyTokenService.removeKeyById(keyStore._id);
    return {
      result,
    };
  };

  static signIn = async ({ email, password, refreshToken = null }) => {
    /*
1. check mail in dtb 
2. match password 
3. create AT vs RT and save database 
4. generate Token 
5. get data return login 
*/
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestErr("shop ko ton tai");
    // 2
    const matchPassword = bcrypt.compare(password, foundShop.password);
    if (!matchPassword) throw new AuthFailure("Đăng nhập thất bại");
    // 3
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    // 4
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: getInforData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };
  static signUp = async ({ email, password, name }) => {
    // try {
    const holderShop = await shopModel.findOne({ email }).lean();
    console.log("holderShop", holderShop);
    if (holderShop) {
      // return {
      //   code: "xxxx",
      //   message: "Shop đã tồn tại !",
      // };
      throw new BadRequestErr("shop da ton tai");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      email,
      password: hashPassword,
      name,
      roles: [roleShop["SHOP"]],
    });
    // create privateKey , Publickey
    if (newShop) {
      // const { privateKey, publicKey } = await crypto.generateKeyPairSync(
      //   "rsa",
      //   {
      //     modulusLength: 4096,
      //     publicKeyEncoding: {
      //       type: "pkcs1",
      //       format: "pem",
      //     },
      //     privateKeyEncoding: {
      //       type: "pkcs1",
      //       format: "pem",
      //     },
      //   }
      // );
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log("privateKey>>>>>", privateKey, publicKey);
      const keyStore = await KeyTokenService.createToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: "",
      });
      if (!keyStore) {
        return {
          code: "xxxx",
          message: "keyStore error !",
        };
      }
      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // console.log("publicKeyObject>>>???", publicKeyObject);
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log("create token success", tokens);
      return {
        code: 201,
        metaData: {
          shop: getInforData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metaData: null,
    };
    // } catch (error) {
    //   console.error(error);
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };
}
module.exports = AccessService;
