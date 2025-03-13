import request from "supertest";
import app from "../src/app";

describe("📚 ADMIN: POST /admin/books", () => {
    it("✅ Should add a new book", async () => {
        const newBook = {
            title: "Test Book",
            author: "Test Author",
            genre: ["Fiction"],
            condition: "excellent",
            isbn: "9781234567897",
            language: "English",
            format: "hardcover",
            price: 29.99,
            currency: "USD",
            publisher: "Test Publisher",
            pubDate: "2024-01-01",
            saleOptions: "individual",
            imageUrl: "https://example.com/book.jpg",
            seller: "Test Seller",
            description: "A test book for testing purposes.",
            location: "Test Location"
        };

        const response = await request(app)
            .post("/admin/books")
            .send(newBook)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe(newBook.title);
        expect(response.body.author).toBe(newBook.author);
    });

    it("❌ Should return an error for incomplete information", async () => {
        const response = await request(app)
            .post("/admin/books")
            .send({ title: "Incomplete Book" }) // Missing required fields
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400);

        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toContain("Missing required fields");
    });
});

describe("📚 ADMIN: PUT /admin/books/:id", () => {
    it("✅ Should update an existing book", async () => {
        const updateData = {
            title: "Updated Book Title",
            price: 35.99,
        };

        const bookId = 1; // Assume there's a book with ID 1

        const response = await request(app)
            .put(`/admin/books/${bookId}`)
            .send(updateData)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        expect(response.body.title).toBe(updateData.title);
        expect(response.body.price).toBe(updateData.price);
    });

    it("❌ Should return 404 for updating a non-existent book", async () => {
        const response = await request(app)
            .put("/admin/books/99999") // Non-existent ID
            .send({ title: "Non-existent Update" })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404);

        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toContain("Book not found");
    });
});

describe("📚 ADMIN: DELETE /admin/books/:id", () => {
    it("✅ Should delete an existing book", async () => {
        const bookId = 1; // Assume book exists

        const response = await request(app)
            .delete(`/admin/books/${bookId}`)
            .set("Accept", "application/json")
            .expect(204); // No content

        expect(response.text).toBe("");
    });

    it("❌ Should return 404 for deleting a non-existent book", async () => {
        const response = await request(app)
            .delete("/admin/books/99999") // Non-existent ID
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404);

        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toContain("Book not found");
    });
});
