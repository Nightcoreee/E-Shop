import "./config/config.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createTables } from "./utils/create.Tables.js";
import { errorMiddleware } from "./middlewares/error.Middleware.js";
import authRoutes from "./router/auth.Routes.js";
import productRoutes from "./router/product.Routes.js";
import orderRoutes from "./router/order.Routes.js";
import adminRoutes from "./router/admin.Routes.js";
import database from "./database/db.js";
import stripe from "stripe";

const app = express();


app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message || error}`);
    }

    // Handling the Event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent_client_secret = event.data.object.client_secret;
      try {
        // FINDING AND UPDATED PAYMENT
        const updatedPaymentStatus = "Paid";
        const paymentTableUpdateResult = await database.query(
          `UPDATE payments SET payment_status = $1 WHERE payment_intent_id = $2 RETURNING *`,
          [updatedPaymentStatus, paymentIntent_client_secret]
        );
        await database.query(
          `UPDATE orders SET paid_at = NOW() WHERE id = $1 RETURNING *`,
          [paymentTableUpdateResult.rows[0].order_id]
        );

        // Reduce Stock For Each Product
        const orderId = paymentTableUpdateResult.rows[0].order_id;

        const { rows: orderedItems } = await database.query(
          `
            SELECT product_id, quantity FROM order_items WHERE order_id = $1
          `,
          [orderId]
        );

        // For each ordered item, reduce the product stock
        for (const item of orderedItems) {
          await database.query(
            `UPDATE products SET stock = stock - $1 WHERE id = $2`,
            [item.quantity, item.product_id]
          );
        }
      } catch (error) {
        return res
          .status(500)
          .send(`Error updating paid_at timestamp in orders table.`);
      }
    }
    res.status(200).send({ received: true });
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    tempFileDir:  "./uploads",
    useTempFiles: true,
    parseNonFileFields: true,
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);

createTables();

app.use(errorMiddleware)

export default app;