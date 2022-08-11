import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import {QueryResult} from 'pg';
import { db } from './db';

const app = express();

app.use(cors());
app.use(express.json());

// Get all products
app.get("/api/v1/products", async (req, res) => {
    try {
        const results: QueryResult = await db.query("SELECT * FROM products", []);
        console.log(results);

        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                products: results.rows,
            },
        });
    } catch (err) {
        console.error(err);
    }
});

// Get a product
app.get("/api/v1/products/:id", async (req, res) => {
    console.log(req.params.id);

    try {
        const results: QueryResult = await db.query("SELECT * FROM products WHERE id=$1", [req.params.id]);

        res.status(200).json({
            status: "success",
            data: {
                product: results.rows[0],
            },
        });
    } catch (err) {
        console.error(err);
    }
});

// Create a product
app.post("/api/v1/products", async (req, res) => {
    try {
        const results: QueryResult = await db.query("INSERT INTO products (name, model, year) VALUES ($1, $2, $3) returning *", 
                                                    [req.body.name, req.body.model, req.body.year]);

        res.status(201).json({
            status: "success",
            data: {
                product: results.rows[0],
            },
        });
    } catch (err) {
        console.error(err);
    }
});

// Update
app.put("/api/v1/products/:id", async (req, res) => {
    try {
        const results: QueryResult = await db.query("UPDATE products SET name = $1, model = $2, year = $3 where id = $4 returning *", 
                                                    [req.body.name, req.body.model, req.body.year, req.params.id]); 

        res.status(200).json({
            status: "success",
            data: {
                product: results.rows[0],
            },
        });
    } catch (err) {
        console.error(err);
    }
});

// Delete 
app.delete("/api/v1/products/:id", async (req, res) => {
    try {
        const results: QueryResult = await db.query("DELETE FROM products where id = $1", [req.params.id]);

        res.status(204).json({
            status: "success",
        });
    } catch (err) {
        console.error(err);
    }
});

const port: number = parseInt(process.env.PORT!) || 3000;
app.listen(port, () => {
    console.log(`Server is up, listening on port ${port}`);
});
