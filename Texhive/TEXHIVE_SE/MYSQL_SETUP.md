# TexHive MySQL Setup

## 1. Create the database

In MySQL Workbench:

```sql
DROP DATABASE IF EXISTS texhive;
CREATE DATABASE texhive;
USE texhive;
```

Do not manually create the tables. When Spring Boot starts, `schema.sql` creates the marketplace tables and JPA creates/updates the `users` entity.

## 2. Check application.properties

Open:

`backend-springboot/src/main/resources/application.properties`

Set your own MySQL password in:

`spring.datasource.password=...`

The database is:

`jdbc:mysql://localhost:3306/texhive`

## 3. Start the Spring Boot backend

```bash
cd backend-springboot
mvn spring-boot:run
```

The API runs at:

`http://localhost:8080`

Health check:

`http://localhost:8080/api/health`

Expected database value:

`MYSQL_CONNECTED`

## 4. Start the frontend

From `TEXHIVE_SE`:

```bash
npm install
npm start
```

Open:

`http://localhost:3000`

## 5. Database flow

Registration -> Spring Boot -> MySQL `users`

Supplier products -> MySQL `products`

Buyer RFQ -> MySQL `rfqs`

Supplier quotation -> MySQL `quotations`

Accepted quotation -> MySQL `orders`

Payment request -> MySQL `payments`

The project does not use browser `localStorage` for application data. `sessionStorage` is used only to keep the currently logged-in user on the browser session; all business data is stored in MySQL.

## 6. Product rule

There are no seeded/default products.

A new supplier starts with zero products. A product appears in the buyer marketplace only after:

1. Supplier registers.
2. Admin verifies the supplier.
3. Supplier adds a product.
4. The product is stored in MySQL.
5. The product has `ACTIVE` status.

Pending supplier products are hidden from buyers but visible to Admin.

## 7. Admin login

Predefined Admin login:

- Email: `admin@texhive.com`
- Password: `Admin@12345`

Supplier verification remains an Admin-only action.

Shipment functionality is not included.
