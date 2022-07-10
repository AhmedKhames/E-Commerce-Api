import { Arg, Args, Ctx, Query, Resolver } from "type-graphql";
import { SessionCtx } from "../helperTypes/Session";
import { Product } from "../models/Product";

@Resolver((of) => Product)
export class ProductResolver {
  @Query((returns) => [Product])
  async getAllProducts(
    @Arg("page", { defaultValue: 1 }) page: number
  ): Promise<Product[]> {
    let perPage = 2;
    return Product.findAll({
      limit: perPage,
      offset: (page - 1) * perPage,
    });
  }

  @Query((returns) => Product)
  async getProduct(
    @Arg("prodId") productId: number,
    @Ctx() context: SessionCtx
  ): Promise<Product | null> {
    let product = await Product.findByPk(productId);
    if (product) {
      return product;
    } else {
     
      return null;
    }
  }
}
