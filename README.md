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
    * Sign up - {Base Url}/auth/signup
    * Login - {Base Url}/auth/login
    * Create category - {Base Url}/admin/create-category
    * Update category - {Base Url}/admin/update-category/{categoryId}
    * Delete category - {Base Url}/admin/delete-category/{categoryId}
    * Create product - {Base Url}/admin/create-product
    * Update product - {Base Url}/admin/update-product/{productId}
    * Delete product - {Base Url}/admin/delete-product/{productId}

* GraphQl [The Schema](https://github.com/AhmedKhames/E-Commerce-Api/blob/master/schema.gql)
    * Mutations
        * add product to cart
            > addToCart(product: Float!): Cart_item!
        * delete from cart 
            > deleteFromCart(prodId: Float!): Boolean!
        * place order using cash on delivery option 
            >   addOrder(address: String = "", cart: Float!, payType: String!, phoneNumber: String = ""): Order!
        * place order using bank card 
            >   addOrderUsingCard(address: String = "", cardInfo: CardInput!, cart: Float!, phoneNumber: String = ""): Order!
    * Queries
        * get all products using pagination 
            >  getAllProducts(page: Float = 1): [Product!]!
        * get all categories  using pagination 
            > getAllProductCategories(page: Float = 1): [Product_Category!]!
        
        * get one product by id 
            >  getProduct(prodId: Float!): Product!
        * get one category by id  
            > getProductCategory(prodId: Float!): Product_Category!  
        * get cart items 
            > getCartItems: CartData!
        * get order items
            > getOrderItems(orderId: Float!): OrderData!
        * get orders history
            > getOrdersHistory: [OrderData!]!





    
 

