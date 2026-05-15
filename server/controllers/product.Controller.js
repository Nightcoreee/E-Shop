import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = catchAsyncError(async (req, res, next) => {
    const { name, description, price, category } = req.body;

    const created_by = req.user.id;

    if(!name || !description || !price || !category) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    let uploadImages = [];
    if(req.files && req.files.images) {
        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        for (const image of images) {
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "Ecommerce_products_images",
                width: 1000,
                crop: "scale",
            });

            uploadImages.push({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }
    }

    const product = await database.query(
        `INSERT INTO products (name, description, price, category, stock, images, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
            name, 
            description, 
            price, 
            category, 
            stock,
            JSON.stringify(uploadImages), 
            created_by
        ]
    );

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: product.rows[0],
    });
});