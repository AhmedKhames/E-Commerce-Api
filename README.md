#  E-commerce Api

A REST and GraphQl ecommerce Api using NodeJs , TypeScript , express.js and MySql database with sequelize ORM with Stripe Api for payment method

## Main Features
* User Authentication
* Adding ,deleting and updating category and product
* Shopping Cart 
* Order placement with card or cash on delivery payment options

## Getting Started
### Installation 
> 1. npm install
> 2. Modify the .env file with your configurations 

## Endpoints
* REST API

    | Endpoint    | HTTP Method | Usage | Returns | Require Authentication |
    | :----------: |:-----------:|:-------:|:--------:|:----------:|
    |/auth/signup | PUT| accept email, name, password,address and phone number of the user | user Id | NO |
    | /auth/login | POST | accept email and password | the JWT token| NO |
    | /admin/create-category | POST | accept name ,description and image for a category | the created product information | YES |
    | /admin/update-category/{categoryId} | PUT | accept categoryId as parameter and the field which will updated in the body | the updated category | YES |    
    |/admin/delete-category/{categoryId} | DELETE |categoryId as parameter | success or fail deletion | YES
    |/admin/create-product |POST|accept name ,description , image,price and quantity for a product|the creted product|YES|
    |/admin/update-product/{productId}|PUT|accept productId as parameter and the field which will updated in the body|the updated product|YES|
    |/admin/delete-product/{productId}|DELETE|productId as parameter | success or fail deletion |YES|


* GraphQL [The Schema](https://github.com/AhmedKhames/E-Commerce-Api/blob/master/schema.gql)
1. Mutations

| Function    | Usage | 
| :----------: |:-----------:|
|add product to cart|addToCart(product: Float!): Cart_item!|
|delete from cart |deleteFromCart(prodId: Float!): Boolean!|
|place order using cash on delivery option |addOrder(address: String = "", cart: Float!, payType: String!, phoneNumber: String = ""): Order!|
|place order using bank card |addOrderUsingCard(address: String = "", cardInfo: CardInput!, cart: Float!, phoneNumber: String = ""): Order!|
  
 2. Queries

| Function    | Usage | 
| :----------: |:-----------:|
|get all products using pagination |getAllProducts(page: Float = 1): [Product!]!|
|get all categories using pagination |getAllProductCategories(page: Float = 1): [Product_Category!]!|
|get one product by id |getProduct(prodId: Float!): Product!|
|get one category by id  |getProductCategory(prodId: Float!): Product_Category!|
|get cart items |getCartItems: CartData!|
|get order items|getOrderItems(orderId: Float!): OrderData!|
|get orders history|getOrdersHistory: [OrderData!]!| 
 
