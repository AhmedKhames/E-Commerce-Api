import { Op } from "sequelize";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { SessionCtx } from "../helperTypes/Session";
import { Cart } from "../models/Cart";
import { Cart_item } from "../models/Cart_item";
import { Order } from "../models/Order";
import { Order_Item } from "../models/Order_Item";
import { Product } from "../models/Product";
import { UserAddresses } from "../models/UserAddresses";
import { UserPhones } from "../models/UserPhones";
import { Users } from "../models/Users";
import { CartData, CartProduct } from "./Inputs/inputProduct";

@Resolver()
export class OrderResolver {
  @Mutation((returns) => Order)
  async addOrder(
    @Arg("cart") cartId: number,
    @Arg("address", { defaultValue: "" }) address: string,
    @Arg("phoneNumber", { defaultValue: "" }) phoneNumber: string,
    @Ctx() context: SessionCtx
  ): Promise<Order> {
    if (!context.req.isAuth) {
      return Promise.reject("You Must log in");
    }
    let userId = context.req.userId;
    let cart = await Cart.findOne({ where: { id: cartId } });
    let order: Order = new Order();
    let cartItems = await Cart_item.findAll({ where: { CartId: cartId } });

    if (cartItems.length !== 0) {
      if (cart?.UserId.toString() !== context.req.userId.toString()) {
        return Promise.reject("Not your cart");
      }
      let user = await Users.findOne({ where: { id: cart.UserId.toString() } });
      let addresses;
      if (address.length !== 0) {
        addresses = await UserAddresses.create({
          UserId: user?.id,
          address: address,
        });
        if (user) {
          user.addressId = addresses.id;
        }
      } else {
        addresses = await UserAddresses.findOne({
          where: { UserId: user?.id },
        });

        address = addresses!.address.toString();
      }

      let phoneNumbers;
      if (phoneNumber.length !== 0) {
        phoneNumbers = await UserPhones.create({
          UserId: user?.id,
          phoneNumber: phoneNumber,
        });
        if (user) {
          user.phoneNumberId = phoneNumbers.id;
        }
      } else {
        phoneNumbers = await UserPhones.findOne({
          where: { UserId: user?.id },
        });

        phoneNumber = phoneNumbers!.phoneNumber.toString();
      }
      await user?.save();
      // quantity ProductId
      let totalSum = 0;
      let totalQuantity = 0;
      for (const item of cartItems) {
        let product = await Product.findOne({ where: { id: item.ProductId } });
        let quantity = item.quantity;
        if (product) {
          totalSum += product.price * quantity;
        }
        totalQuantity += quantity;
      }
      order = await Order.create({
        address: address,
        phoneNumber: phoneNumber,
        total: totalSum,
        UserId: cart.UserId,
      });
      let orderId = order.id;
      let orders = [];
      for (const item of cartItems) {
        let prodId = item.ProductId;
        let quantity = item.quantity;
        orders.push({
          quantity: quantity,
          OrderId: orderId,
          ProductId: prodId,
        });
      }
      let orderItems = await Order_Item.bulkCreate(orders);

      cartItems.forEach((item) => {
        item.destroy();
      });
      return order;
    } else {
      return Promise.reject("The cart is empty");
    }
  }

    // @Query(returns=>)
}
