import express from "express";
import { Cart } from "./models/Cart";
import { Cart_item } from "./models/Cart_item";
import { Order } from "./models/Order";
import { Order_Item } from "./models/Order_Item";
import { Payment_Details } from "./models/Payment_Details";
import { Product } from "./models/Product";
import { Product_Category } from "./models/Product_Category";
import { Users } from "./models/Users";
import sequelize from "./utils/database";
import authRoute from "./routes/Auth";
import adminRoute from "./routes/Admin";
import bodyParser from "body-parser";
import { isAuth } from "./middleware/isAuth";
import multer from "multer";
import fs from "fs";
import path from "path";
const { v4: uuidv4 } = require("uuid");
import { graphqlHTTP } from "express-graphql";
// import schema from "./graphql/schema";
//const graphqlResolver = require('./graphql/resolver');
// import graphqlResolver from "./graphql/resolver";
import { buildSchema } from "type-graphql";
import { ProductResolver } from "./graphqlResolvers/ProductResolver";
import { ProductCategoryResolver } from "./graphqlResolvers/CategoryResolver";
import { CartResolver } from "./graphqlResolvers/CartResolver";
import { CartData } from "./graphqlResolvers/Inputs/inputProduct";
import { UserPhones } from "./models/UserPhones";
import { UserAddresses } from "./models/UserAddresses";
import { OrderResolver } from "./graphqlResolvers/OrderResolver";
import { PayType } from "./models/PayType";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(path.join(__dirname, "..", "images"), () => {
      //console.log(path.join(__dirname,'..', "images"))
      cb(null, "images");
    });
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: any
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/// create tables and its relationships MySql;
Users.hasOne(Cart);
Cart.belongsTo(Users);
Users.hasMany(UserAddresses);
UserAddresses.belongsTo(Users)
Users.hasMany(UserPhones);
UserPhones.belongsTo(Users)
Product.belongsTo(Users, { constraints: true, onDelete: "CASCADE" });
Users.hasMany(Product);
Users.hasMany(Product_Category);
Product_Category.belongsTo(Users);
Product_Category.hasMany(Product);
Product.belongsTo(Product_Category);
Cart.belongsToMany(Product, { through: Cart_item });
Users.hasMany(Order);
Order.belongsTo(Users);
Order.belongsToMany(Product, { through: Order_Item });
Order.hasOne(Payment_Details);
// Payment_Details.hasOne(PayType);
// PayType.belongsTo(Payment_Details);


async function run() {
  require("dotenv").config();
  const app = express();

  app.use(bodyParser.json());

  app.use(
    multer({
      storage: fileStorage,
      fileFilter: fileFilter,
    }).single("imageUrl")
  );

  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    next();
  });

  app.use(isAuth);
  //register routes for the REST Api
  app.use("/auth", authRoute);

  app.use("/admin", adminRoute);

  app.use((error: any, req: any, res: any, next: any) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
      message: message,
    });
  });

  const schema = await buildSchema({
    resolvers: [ProductResolver, ProductCategoryResolver, CartResolver,OrderResolver],
    emitSchemaFile: true,
    // orphanedTypes:[CartData]
  });
  app.use(
    "/graphql",
    graphqlHTTP((req, res, graphQLParams)=>
    {
     return { schema: schema,
      graphiql: true,
      context:{ req},
     }
    })
  );
  sequelize
    //  .sync({ alter: true })
    // .then(data =>{
    //   PayType.bulkCreate([{type:'COD'},{type:'CARD'}]).then(sucess=>{
    //     console.log("Connection has been established successfully.");
    //     app.listen(process.env.APPLICATION_PORT, () => {
    //       console.log(`Litening on port  ${process.env.APPLICATION_PORT}`);
    //     });
    //   }).catch((err) => {
    //     console.error("Unable to connect to the database:", err);
    //   });
    // })
  
    .sync()
    .then((res) => {
      //console.log(res);
      console.log("Connection has been established successfully.");
      app.listen(process.env.APPLICATION_PORT, () => {
        console.log(`Litening on port  ${process.env.APPLICATION_PORT}`);
      });
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
}
run();
