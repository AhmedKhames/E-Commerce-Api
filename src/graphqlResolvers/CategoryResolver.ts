import { Arg, Args, Ctx, Query, Resolver } from "type-graphql";
import { SessionCtx } from "../helperTypes/Session";
import { Product_Category } from "../models/Product_Category";

@Resolver((of) => Product_Category)
export class ProductCategoryResolver {
  @Query((returns) => [Product_Category])
  async getAllProductCategories(
    @Arg("page", { defaultValue: 1 }) page: number
  ): Promise<Product_Category[]> {
    let perPage = 2;
    return Product_Category.findAll({
      limit: perPage,
      offset: (page - 1) * perPage,
    });
  }

  @Query((returns) => Product_Category)
  async getProductCategory(
    @Arg("prodId") productId: number,
    
  ): Promise<Product_Category | null> {
    let product = await Product_Category.findByPk(productId);
    if (product) {
      return product;
    } else {
      //    context.res.status(404).json({
      //       message:"Product Not Found"
      //   })
      return null;
    }
  }
}
