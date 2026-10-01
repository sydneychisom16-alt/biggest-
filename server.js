const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;


/* Allow the server to receive JSON data */

app.use(express.json());


/* Serve the website from the public folder */

app.use(express.static(path.join(__dirname, "public")));


/* Location of our orders file */

const ordersFile = path.join(__dirname, "orders.json");


/* Create orders.json if it doesn't exist */

if (!fs.existsSync(ordersFile)) {

    fs.writeFileSync(
        ordersFile,
        "[]"
    );

}


/* ================= ORDER API ================= */

app.post("/api/orders", (req, res) => {

    const order = req.body;


    /* Check required information */

    if (
        !order.name ||
        !order.phone ||
        !order.food
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Please fill in all required fields."

        });

    }


    /* Read existing orders */

    const orders = JSON.parse(
        fs.readFileSync(
            ordersFile,
            "utf8"
        )
    );


    /* Give the order an ID and date */

    order.id = Date.now();

    order.date =
        new Date().toLocaleString();


    /* Add the new order */

    orders.push(order);


    /* Save the updated orders */

    fs.writeFileSync(

        ordersFile,

        JSON.stringify(
            orders,
            null,
            2
        )

    );


    /* Send success response */

    res.json({

        success: true,

        message:
            "Order received successfully!",

        orderId:
            order.id

    });

});


/* ================= START SERVER ================= */

app.listen(PORT, () => {

    console.log(
        `FlavourHouse is running at http://localhost:${PORT}`
    );

});