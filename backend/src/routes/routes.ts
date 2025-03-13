import express from "express";
import * as productController from "../controllers/productController";
import * as searchController from "../controllers/searchController";
import * as adminController from "../controllers/adminController";


const router = express.Router();


//router.get("/products", productController.getAllProducts);
router.get("/products", productController.getProducts);

router.get("/products/featured", productController.getFeatured);
router.get("/products/first-editions", productController.getFirstEditions);
router.get("/products/rare-books", productController.getRareBooks);
router.get("/products/maps", productController.getMaps);
router.get("/products/periodicals", productController.getPeriodicals);

// Search
router.get("/search/books", searchController.searchBooks);
router.get("/search/maps", searchController.searchMaps);
router.get("/search/periodicals", searchController.searchPeriodicals);

// Admin
router.post("/admin/books", adminController.addBook);
router.put("/admin/books/:id", adminController.updateBook);
router.delete("/admin/books/:id", adminController.deleteBook);

router.post("/admin/maps", adminController.addMap);
router.put("/admin/maps/:id", adminController.updateMap);
router.delete("/admin/maps/:id", adminController.deleteMap);

// Auth Routes - if we are using Firebase perhaps we don't need this?
router.post("auth/register");
router.post("auth/login");
router.get("auth/me");


export default router;