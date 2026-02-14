const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// Configura tu Access Token de MP
const client = new MercadoPagoConfig({ 
    accessToken: 'TU_ACCESS_TOKEN_AQUÍ' 
});

app.post("/create_preference", async (req, res) => {
    try {
        const preference = new Preference(client);
        const body = {
            items: req.body.items, // Recibe los productos del carrito
            back_urls: {
                success: "https://tu-sitio.com",
                failure: "https://tu-sitio.com",
                pending: "https://tu-sitio.com",
            },
            auto_return: "approved",
        };

        const response = await preference.create({ body });
        res.json({ id: response.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la preferencia" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

const mp = new MercadoPago('TU_PUBLIC_KEY_AQUÍ', { locale: 'es-AR' });

async function iniciarPagoMP() {
    // 1. Obtener items del carrito (ajusta 'carrito' según tu variable)
    const itemsParaMP = carrito.map(item => ({
        title: item.nombre,
        unit_price: Number(item.precio),
        quantity: 1,
        currency_id: "ARS"
    }));

    // 2. Llamar a tu servidor en Render
    const response = await fetch("https://tu-app-en-render.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsParaMP })
    });

    const preference = await response.json();

    // 3. Mostrar el botón oficial
    mp.bricks().create("wallet", "wallet_container", {
        initialization: { preferenceId: preference.id },
        customization: { texts: { valueProp: 'smart_option' } }
    });
    
    // Ocultamos el botón gris de "generar" para no duplicar
    document.getElementById("btn-generar-pago").style.display = "none";
}