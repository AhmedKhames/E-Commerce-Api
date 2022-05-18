import { type } from "os";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Users } from "../../models/Users";

@ObjectType()
export class CartProduct  {
  
  @Field({nullable:false})
  name!: string;

  @Field({nullable:false})
  imageUrl!: string;

  @Field({nullable:false})
  description!: string;

  @Field({nullable:false})
  productId!: number;

  @Field({nullable:false})
  price!: number;

  @Field({nullable:false})
  quantity!: number;

  @Field({nullable:false})
  seller!: string


}

/*
 type PostsData{
        posts : [Post!]!
        totalPosts : Int!
    }
*/
@ObjectType()
export class CartData{
    @Field(type => [CartProduct])
    cartProduct!: CartProduct[];
    
    @Field({nullable:false})
    totalSum!:number
}


@ObjectType()
export class OrderData{

    @Field(type=>ID)
    orderId!:number

    @Field(type => [CartProduct])
    cartProduct!: CartProduct[];
    
    @Field({nullable:false})
    totalSum!:number

    @Field({nullable:false})
    address!:string

    @Field({nullable:false})
    phoneNumber!:string
}
