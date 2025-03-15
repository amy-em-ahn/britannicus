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

## Components

- Cart icon
  - badge

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
npm install --save-dev tailwindcss@3 postcss autoprefixer //4는 아직 불안정
```

## Firebase

```
npm install firebase
```

https://firebase.google.com/docs/auth/web/google-signin

## Cloudinary

https://cloudinary.com/documentation/client_side_uploading#code_explorer_upload_multiple_files_using_a_form_unsigned

https://api.cloudinary.com/v1_1/<cloud name>/<resource_type>/upload
doiqoi3of
PID: ea445541-ea5d-4c30-8bd9-bba5af00e064
Upload preset name: britannicus

## Tanstack react query

```
npm i @tanstack/react-query
```

Britannicus BMS - ProductDetail 페이지 구현 단계

1. 주요 문제점 요약

ProductDetail.jsx 페이지:

Location state 처리 방식이 잘못됨
URL을 통한 직접 접근 시 제품 데이터를 로드하는 기능 부재
Color 및 Size 옵션 선택 처리 오류

ProductCard.jsx:

제품 클릭 시 ProductDetail 페이지로 이동할 때 state 전달 누락

AddToCartButton.jsx:

카트 추가 핸들러 함수가 구현되지 않음

2. 파일별 수정 사항
   ProductDetail.jsx

useParams를 사용하여 URL에서 productId 추출
useEffect를 사용하여:

location.state에서 제품 데이터 확인
state에 데이터가 없으면 API 호출하여 제품 정보 가져오기

로딩 상태와 오류 처리 추가
색상 및 사이즈 옵션 선택 로직 수정 (배열 확인 후 처리)
ProductOrderInfo 컴포넌트에 필요한 props 전달

ProductCard.jsx

제품 클릭 이벤트 핸들러 수정:

navigate 함수 호출 시 state 객체에 product 정보 포함

이벤트 전파 관리 및 디자인 개선

AddToCartButton.jsx

useAuthContext 훅 사용하여 사용자 인증 정보 가져오기
클릭 핸들러 구현:

이벤트 버블링 방지
사용자 로그인 상태 확인
카트에 추가할 제품 데이터 생성
Firebase API 호출하여 카트에 제품 추가
성공/실패 처리

ProductOrderInfo.jsx

수량 선택 기능 추가
선택된 옵션 및 수량 정보를 AddToCartButton에 전달
가격 및 재고 표시 개선

3. 구현 순서

ProductDetail.jsx 수정
ProductCard.jsx 수정
AddToCartButton.jsx 구현
ProductOrderInfo.jsx 수정

4. 테스트 포인트

제품 목록에서 제품 클릭 시 상세 페이지 이동 확인
URL로 직접 상세 페이지 접근 시 데이터 로드 확인
색상/사이즈 옵션 선택 기능 테스트
장바구니 추가 버튼 클릭 시 동작 확인
로그인/비로그인 상태에서의 장바구니 기능 테스트

5. 주의 사항

기존 파일 구조와 네이밍 규칙 유지
인증 컨텍스트 사용 시 useAuthContext 훅 활용
이미 구현된 API 함수들의 파라미터 형식 확인
컴포넌트 import 경로 정확히 확인
