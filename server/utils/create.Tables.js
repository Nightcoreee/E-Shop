import { createUserTable } from "../models/userTable.Table.js";
import { createShippingInfoTable } from "../models/shippinginfo.Table.js";
import { createProductTable } from "../models/product.Table.js";
import { createProductReviewsTable } from "../models/productReviews.Table.js";
import { createPaymentsTable } from "../models/payments.Table.js";
import { createOrdersTable } from "../models/orders.Table.js";
import { createOrderItemsTable } from "../models/orderItems.Table.js";


export const createTables = async () => {
    try {
        await createUserTable();
        await createShippingInfoTable();
        await createProductTable();
        await createProductReviewsTable();
        await createPaymentsTable();
        await createOrdersTable();
        await createOrderItemsTable();
        console.log("All Tables created successfully");
        } catch (error) {
            console.error("Error creating tables:", error);
    }
}