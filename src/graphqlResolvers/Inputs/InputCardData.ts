import { Field, InputType } from "type-graphql";

@InputType()
export class CardInput{
    @Field({nullable:false})
    cardNumber!:string;
 
    @Field({nullable:false})
    cardCVC!:string;

    @Field({nullable:false})
    cardExpDate!:number;

    @Field({nullable:false})
    cardExpYear!:number;
}