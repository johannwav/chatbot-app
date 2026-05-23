const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", (req, res) => {
    const message = req.body.message.toLowerCase();
    let reply = "No entendí tu mensaje.";

    if (message.includes("hola")) {
        reply = "Hola 👋 ¿Cómo puedo ayudarte?";
    }
    else if (message.includes("adios") || message.includes("adiós")) {
        reply = "Hasta luego 🚀";
    }
    else if (message.includes("nombre")) {
        reply = "Soy un chatbot creado con React y Node.js";
    }

    res.json({ reply });
});

app.listen(5000, () => {
    console.log("Servidor corriendo en puerto 5000");
});