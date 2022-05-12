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
import authRoute from './routes/Auth';
import adminRoute from './routes/Admin';
import bodyParser from 'body-parser';
import { isAuth } from "./middleware/isAuth";

require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(isAuth)
//register routes for the REST Api
app.use('/auth',authRoute);

app.use('/admin',adminRoute);

app.use((error:any, req:any, res:any, next:any) => {

  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({
    message: message,
  });
});

Users.hasOne(Cart);
Cart.belongsTo(Users);
Product.belongsTo(Users,{constraints:true, onDelete:'CASCADE'});
Users.hasMany(Product);
Users.hasMany(Product_Category);
Product_Category.belongsTo(Users);
Product_Category.hasMany(Product);
Product.belongsTo(Product_Category);
Cart.belongsToMany(Product ,{through:Cart_item});
Users.hasMany(Order);
Order.belongsTo(Users);
Order.belongsToMany(Product,{through:Order_Item});
Order.hasOne(Payment_Details);


sequelize
  // .sync({ force: true })
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
