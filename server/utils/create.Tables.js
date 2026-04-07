import { createUserTable } from "../models/user.Table.js";
import { createShippingInfoTable } from "../models/shippinginfo.Table.js";
import { createProductTable } from "../models/product.Table.js";
import { createProductReviewsTable } from "../models/productReviews.Table.js";
import { createPaymentsTable } from "../models/payments.Table.js";
import { createOrdersTable } from "../models/orders.Table.js";
import { createOrderItemsTable } from "../models/orderItems.Table.js";


export const createTables = async () => {
    try {
        await createUserTable();
        await createProductTable();
        await createProductReviewsTable();
        await createOrdersTable();
        await createShippingInfoTable();
        await createPaymentsTable();
        await createOrderItemsTable();
        } catch (error) {
            console.error("Error creating tables:", error);
    }
}