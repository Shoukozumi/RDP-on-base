const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Project_Apps = require("../models/project_app_connections_model");
const {template_selector} = require("../controller/action_template_controller");

require("dotenv").config();

const {
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    SHOPIFY_REDIRECT_URI,
    SHOPIFY_SCOPES,
    MONGODB_URI
} = process.env;

function generateNonce() {
    return require("crypto").randomBytes(16).toString("base64");
}

router.get('/install', async (req, res) => {
    const { shop } = req.query;

    const state = generateNonce();
    const installUrl = `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SHOPIFY_SCOPES}&state=${state}&redirect_uri=${SHOPIFY_REDIRECT_URI}`;

    // TODO: Simplify after the app is published
    res.cookie("state", state);
    res.json({ installUrl, state });
});

router.get('/callback', async (req, res) => {
    const {shop: shop_name, code, state} = req.query;

    const access_token_url = `https://${shop_name}/admin/oauth/access_token`;

    const access_token_payload = {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code
    };

    const response = await fetch(access_token_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(access_token_payload)
    });

    const access_token_json = await response.json();

    const access_token = access_token_json.access_token;

    console.log(access_token)

    try {
        const app_name = shop_name.split(".")[0];
        const app_type = "Shopify";
        const app_credentials = {
            shop_name: app_name,
            access_token: access_token
        };

        console.log("app_name: ", app_name)
        console.log("app_type: ", app_type)
        console.log("app_credentials: ", app_credentials)


        const project_id = '6681fdb47457390f4c5d191f';
        const owner_id = '667dd04d22cd933b71ab72fd';

        const new_app = new Project_Apps({
            project_id,
            owner_id,
            app_name,
            app_type,
            app_credentials
        });
        const saved_app = await new_app.save();

        const app_template =  template_selector(app_type);
        await app_template.generate_and_save_FPAT(app_credentials, owner_id, project_id, saved_app._id);
        const FPATs = await app_template.get_FPATs(owner_id, project_id, saved_app._id);
        console.log(FPATs)
        res.redirect("http://localhost:3001/success")
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error creating app', error });
    }

});

module.exports = router;