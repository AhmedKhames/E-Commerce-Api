import { Op } from "sequelize";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { SessionCtx } from "../helperTypes/Session";
import { Cart } from "../models/Cart";
import { Cart_item } from "../models/Cart_item";
import { Order } from "../models/Order";
import { Order_Item } from "../models/Order_Item";
import { Payment_Details } from "../models/Payment_Details";
import { PayType } from "../models/PayType";
import { Product } from "../models/Product";
import { UserAddresses } from "../models/UserAddresses";
import { UserPhones } from "../models/UserPhones";
import { Users } from "../models/Users";
import { CardInput } from "./Inputs/InputCardData";
import { CartData, CartProduct, OrderData } from "./Inputs/inputProduct";

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

@Resolver()
export class OrderResolver {
  @Mutation((returns) => Order)
  async addOrderUsingCard(
    @Arg("cart") cartId: number,
    @Arg("address", { defaultValue: "" }) address: string,
    @Arg("phoneNumber", { defaultValue: "" }) phoneNumber: string,
    @Arg("cardInfo") cardInfo: CardInput,
    @Ctx() context: SessionCtx
  ): Promise<Order> {
    if (!context.req.isAuth) {
      throw new Error("You Must log in");
    }
    let userId = context.req.userId;
    let loggedUser = await Users.findByPk(userId);
    let cart = await Cart.findOne({ where: { id: cartId } });
    let order: Order = new Order();
    let cartItems = await Cart_item.findAll({ where: { CartId: cartId } });

    if (cartItems.length !== 0) {
      if (cart?.UserId.toString() !== context.req.userId.toString()) {
        throw new Error("Not your cart");
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
      // let orderItems = await Order_Item.bulkCreate(orders);

      // to create stripe customer we need
      // 1 - email 2 - name  3 - token that generated from card number and CVC

      try {
        const token = await stripe.tokens.create({
          card: {
            number: cardInfo.cardNumber,
            exp_month: cardInfo.cardExpDate,
            exp_year: cardInfo.cardExpYear,
            cvc: cardInfo.cardCVC,
          },
        });

        const customer = await stripe.customers.create({
          name: loggedUser?.name,
          email: loggedUser?.email,
          source: token.id,
        });
        const charge = await stripe.charges.create({
          amount: order.total,
          currency: "usd",
          customer: customer.id,
          description: "Thanks",
        });
        cartItems.forEach((item) => {
          item.destroy();
        });
        return order;
      } catch (error) {
        console.log(error);
        throw new Error("Payment Error");
      }
    } else {
      throw new Error("The cart is empty");
    }
  }

  @Mutation((returns) => Order)
  async addOrder(
    @Arg("cart") cartId: number,
    @Arg("address", { defaultValue: "" }) address: string,
    @Arg("phoneNumber", { defaultValue: "" }) phoneNumber: string,
    @Arg("payType") payType: string,
    @Ctx() context: SessionCtx
  ): Promise<Order> {
    if (!context.req.isAuth) {
      throw new Error("You Must log in");
    }
    let userId = context.req.userId;
    let cart = await Cart.findOne({ where: { id: cartId } });
    let order: Order = new Order();
    let cartItems = await Cart_item.findAll({ where: { CartId: cartId } });

    if (cartItems.length !== 0) {
      if (cart?.UserId.toString() !== context.req.userId.toString()) {
        throw new Error("Not your cart");
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
      // let orderItems = await Order_Item.bulkCreate(orders);

      if (payType === "COD") {
        await Order_Item.bulkCreate(orders);
        let paymentType = await PayType.findOne({ type: payType });
        if (paymentType) {
          await Payment_Details.create({
            amount: order.total,
            pay_type: paymentType.id,
            OrderId: order.id,
          });
        }
      }

      cartItems.forEach((item) => {
        item.destroy();
      });
      return order;
    } else {
      throw new Error("The cart is empty");
    }
  }

  @Query((returns) => OrderData)
  async getOrderItems(
    @Arg("orderId") orderId: number,
    @Ctx() context: SessionCtx
  ): Promise<OrderData> {
    if (!context.req.isAuth) {
      return Promise.reject("You Must log in");
    }

    let order = await Order.findOne({
      where: { [Op.and]: [{ id: orderId }, { UserId: context.req.userId }] },
    });
    let orderProducts: CartProduct[] = [];
    if (order) {
      let orderItem = await Order_Item.findAll({
        where: { OrderId: order.id },
      });
      let address = order.address,
        phoneNumber = order.phoneNumber;
      let total: number = +order.total;

      for (const item of orderItem) {
        let product = await Product.findOne({ where: { id: item.ProductId } });
        if (product) {
          let seller = await Users.findOne({ where: { id: product.UserId } });

          let orderProduct = {
            name: product.name,
            imageUrl: product.imageUrl,
            description: product.description,
            productId: product.id,
            price: product.price,
            quantity: item.quantity,
            seller: seller!.name,
          };
          orderProducts.push(orderProduct);
        }
      }
      let orderData: OrderData = {
        address: address,
        cartProduct: orderProducts,
        phoneNumber: phoneNumber,
        totalSum: total,
        orderId: orderId,
      };
      return orderData;
    } else {
      throw new Error("No Order found");
    }
  }

  @Query((returns) => [OrderData])
  async getOrdersHistory(@Ctx() context: SessionCtx): Promise<OrderData[]> {
    if (!context.req.isAuth) {
      return Promise.reject("You Must log in");
    }

    let orders = await Order.findAll({
      where: { [Op.and]: [{ UserId: context.req.userId }] },
    });

    let allOrders: OrderData[] = [];
    if (orders.length > 0) {
      for (const order of orders) {
        let orderProducts: CartProduct[] = [];
        let orderItem = await Order_Item.findAll({
          where: { OrderId: order.id },
        });
        let address = order.address,
          phoneNumber = order.phoneNumber;
        let total: number = +order.total;
        if (orderItem.length > 0) {
          for (const item of orderItem) {
            let product = await Product.findOne({
              where: { id: item.ProductId },
            });
            if (product) {
              let seller = await Users.findOne({
                where: { id: product.UserId },
              });

              let orderProduct = {
                name: product.name,
                imageUrl: product.imageUrl,
                description: product.description,
                productId: product.id,
                price: product.price,
                quantity: item.quantity,
                seller: seller!.name,
              };
              orderProducts.push(orderProduct);
            }
          }

          let orderData: OrderData = {
            address: address,
            cartProduct: orderProducts,
            phoneNumber: phoneNumber,
            totalSum: total,
            orderId: order.id,
          };
          allOrders.push(orderData);
        }
      }
      return allOrders;
    } else {
      throw new Error("No Orders found");
    }
  }
}
