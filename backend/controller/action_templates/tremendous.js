const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));


const FPAT = require('../../models/project_first_party_action_templates_model');

const app_type = 'Tremendous'
const action_templates_type = [
    "Tremendous::gift_card",
]

async function generate_and_save_FPAT(app_credentials, owner_id, project_id, app_id) {
    const tremendous_api_key = app_credentials;

    async function getProducts() {
        const productUrl = `https://testflight.tremendous.com/api/v2/products?currency=USD`;

        const response = await fetch(productUrl, {
            method: "GET",
            headers: {
                "accept": "application/json",
                "authorization": `Bearer ${tremendous_api_key}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        return await response.json();
    }

    const FPAT_records = []
    const products_json = (await getProducts())["products"];


    products_json.forEach( product => {
        // console.log(product["images"]);
        const thumbnail_url = (product["images"].length === 0) ? "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png" : product["images"][0].src;  // TODO: change to a proper default image

        const product_info = {
            product_id: product["id"],
            product_name: product["name"],
            thumbnail_url: thumbnail_url,
            product_countries: product["countries"]
        }

        const FPAT_record = {
            owner_id,
            project_id,
            app_id,
            app_type: app_type,
            action_template_name: `Tokenized ${product_info.product_name} gift card`,
            action_template_type: "Tremendous::gift_card",
            action_template_metadata: {
                "tremendous_product_type": product_info.product_name,
                "tremendous_product_id": product_info.product_id,

            },
            action_template_description: "Generate a gift card redemption link for the selected product. Users can then access the link to get the gift card code",
            action_template_thumbnail: product_info.thumbnail_url,
            action_template_inputs: [
                {
                    "input_name": "Select the gift card value",
                    "input_description": "This will be the cash value of the gift card in USD",
                    "input_type": "single-select",
                    "input_choices": [
                        10,
                        20,
                        30,
                        50,
                        100
                    ],
                    "input_choice_children": []
                }
            ]
        }

        FPAT_records.push(FPAT_record);
    });

    const docs = await FPAT.insertMany(FPAT_records);
}

async function get_FPATs(owner_id, project_id, app_id) {
    const FPAT_records = await FPAT.find({ owner_id, project_id, app_id });
    // get the FPATs with the inputted parameters and parse them into json

    let actions = [];

    FPAT_records.forEach( record => {
        let action = {
            "action_name": record.action_template_name,
            "action_description": record.action_template_description,
            "action_icon": record.action_template_thumbnail,
            "action_metadata": record.action_template_metadata,
            "action_template_type": record.action_template_type,
            "action_template_params": record.action_template_inputs
        }

        actions.push(action);
    });

    return actions;
}

module.exports = {
    generate_and_save_FPAT,
    get_FPATs,
}