## Nav

- Logo
- Products
  - Rare Books
  - Vintaage Maps
  - Periodicals
  - First Editions
- Cart
- Register / Login
- Admin
- (
  _ Dashboard
  _ Marketplace
  \_ Reminder
  )

## Routing

<App>
/
/products - <AllProducts>
/products/new - <NewProduct>
/products/:id - <ProductDetail>
/carts - <MyCart>
/admin - <Admin>
/login - <Login>
/register - <Register>

## Register

## Login

## Admin

- Add products
  - Image
  - Title
  - Price
  - Option
  - Add product button
  - Modal

## Home

- Products
  - Rare Books
  - Vintaage Maps
  - Periodicals
  - First Editions
- Search
- Filter

## Product details

- Category
- Picture
- Title
- Price
- Descriptions
- Options
- Add cart button

## Cart

- Order list
  - Images
  - Title
  - Option
  - Price
  - Count | + | - | del
  - Product price
  - Tax
  - Delivery
  - Total
  - Order button

# Components

- Cart icon
  - badge

## Firebase

```
npm install firebase
```

## Cloudinary

https://api.cloudinary.com/v1_1/<cloud name>/<resource_type>/upload

## React helmet

```
npm install react-helmet-async
```

## React icons

```
npm install react-icons --save
```

## CSS - postcss, tailwind

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install postcss postcss-import postcss-nested postcss-custom-properties autoprefixer postcss-preset-env
```
