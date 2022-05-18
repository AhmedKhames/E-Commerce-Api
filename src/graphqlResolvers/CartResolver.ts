import { Op } from "sequelize";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { SessionCtx } from "../helperTypes/Session";
import { Cart } from "../models/Cart";
import { Cart_item } from "../models/Cart_item";
import { Product } from "../models/Product";
import { Users } from "../models/Users";
import { CartData, CartProduct } from "./Inputs/inputProduct";

@Resolver()
export class CartResolver {
  @Mutation((returns) => Cart_item)
  async addToCart(
    @Arg("product") product: number,
    @Ctx() context: SessionCtx
  ): Promise<Cart_item> {
    if (!context.req.isAuth) {
      return Promise.reject("You Must log in");
    }
    let userId = context.req.userId;
    let cart = await Cart.findOne({ where: { UserId: userId } });
    let cartId = cart?.id;
    let productId = product;

    let cartItem = await Cart_item.findOne({
      where: { [Op.and]: [{ CartId: cartId }, { ProductId: productId }] },
    });

    let newCartItem;
    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
      return cartItem;
    }
    newCartItem = await Cart_item.create({
      CartId: cartId,
      ProductId: productId,
      quantity: 1,
    });
    return newCartItem;
  }

  @Query((returns) => CartData)
  async getCartItems(@Ctx() context: SessionCtx): Promise<CartData> {
    if (!context.req.isAuth) {
      return Promise.reject("You Must log in");
    }

    let cart = await Cart.findOne({ where: { UserId: context.req.userId } });
    let cartId = cart?.id;
    let cartItems = await Cart_item.findAll({ where: { CartId: cartId } });

    let cartProduct: CartProduct;
    let totalCart: CartProduct[] = [];
    let currSum = 0;
    for (const item of cartItems) {
      let prodId = item.ProductId;
      let quantity = item.quantity;
      let product = await Product.findOne({ where: { id: prodId } });
      if (product) {
        let sellerId = product.UserId;
        let seller = await Users.findOne({ where: { id: sellerId } });
        if (seller) {
          let sellerName = seller.name;
          currSum += quantity * product.price;
          cartProduct = {
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            price: product.price,
            productId: product.id,
            seller: sellerName,
            quantity: quantity,
          };

          totalCart.push(cartProduct);
        }
      }
    }

    return {
      cartProduct: totalCart,
      totalSum: currSum,
    };
  }



  @Mutation((returns) => Boolean)
  async deleteFromCart(
    @Arg("prodId") prodId: number,
    @Ctx() context: SessionCtx
  ): Promise<boolean> {
    if (!context.req.isAuth) {
      return Promise.reject("You Must log in");
    }
    let userId = context.req.userId;
    let cart = await Cart.findOne({ where: { UserId: userId } });
    let cartId = cart?.id;

    let deleteItem = await Cart_item.findOne({
      where: { [Op.and]: [{ CartId: cartId }, { ProductId: prodId }] },
    });
    if (deleteItem) {
      if (deleteItem.quantity > 1) {
        deleteItem.quantity -= 1;
        await deleteItem.save();
      } else if (deleteItem.quantity === 1) {
        await deleteItem?.destroy();
      }
      return true;
    } else {
      return false;
    }
  }
}
