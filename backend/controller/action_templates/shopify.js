const get_products = require('./shopify_api');

const FPAT = require('../../models/project_first_party_action_templates_model');

const action_templates_type = [
    "shopify::product_coupon",
]

async function generate_and_save_FPAT(app_credentials, owner_id, project_id, app_id) {

    const { shop_name, access_token } = app_credentials;

    const products_json = (await get_products(shop_name, access_token))["products"];

    const FPAT_records = []

    products_json.forEach( product => {
        const product_info = {
            product_id: product["id"],
            product_name: product["title"],
            product_price: parseFloat(product["variants"][0].price),
            body_html: product["body_html"],
            thumbnail_url: product["image"]?.src || "",
            variant_id: product["variants"][0].id,  // TODO: double check this
        }

        const FPAT_record = {
            owner_id,
            project_id,
            app_id,
            app_type: "Shopify",
            action_template_name: `Tokenized discount coupon for ${product_info.product_name}`,
            action_template_type: "shopify::product_coupon",
            action_template_metadata: {
                "shopify_store_id": shop_name,
                "shopify_product_id": product_info.product_id,
                "shopify_product_name": product_info.product_name,
                "shopify_product_price": product_info.product_price,
            },
            action_template_description: "Generate a secure and unique checkout link with the coupon automatically applied to the shopify item",
            action_template_thumbnail: product_info.thumbnail_url,
            action_template_inputs: [
                {
                    "input_name": "Select your coupon type",
                    "input_description": "Your coupon can either be a percentage discount of the original item price, or it can be a fixed-quantity cash discount.",
                    "input_type": "single-select",
                    "input_choices": [
                        "percentage",
                        "fixed"
                    ],
                    "input_choice_children": [
                        {
                            "input_name": "Input your coupon percentage",
                            "input_description": "Your coupon can either be a percentage discount of the original item price, or it can be a fixed-quantity cash discount.",
                            "input_type": "percentage",
                            "input_choice_children": []
                        },
                        {
                            "input_name": "Input your coupon cash value",
                            "input_description": "Your coupon can either be a percentage discount of the original item price, or it can be a fixed-quantity cash discount.",
                            "input_type": "number",
                            "input_choice_children": []
                        }
                    ]
                },
                {
                    "input_name": "Include a message in the coupon",
                    "input_description": "You can include an optional message in this coupon",
                    "input_type": "string",
                    "input_choice_children": []
                }
            ]
        }

        FPAT_records.push(FPAT_record);
      });

    const docs = await FPAT.insertMany(FPAT_records);
    return FPAT_records;
}

async function get_FPATs(owner_id, project_id, app_id) {
    const FPAT_records = await FPAT.find({ owner_id, project_id, app_id });
    // get the FPATs with the inputted parameters and parse them into json

    let actions = [];

    console.log("Getting FPATs:")
    console.log(FPAT_records)

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