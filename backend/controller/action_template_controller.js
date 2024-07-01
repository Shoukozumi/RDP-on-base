const shopify_templates = require('./action_templates/shopify');
const tremendous_templates = require('./action_templates/tremendous');
const zapier_templates = require('./action_templates/zapier');
const fleek_templates = require('./action_templates/fleek');

function template_selector(app_type) {

    switch (app_type) {
        case "Shopify":
            return shopify_templates;

        case "Tremendous":
            return tremendous_templates;

        case "Zapier":
            return zapier_templates;

        case "Fleek":
            return fleek_templates;
        default:
            // THROW ERROR, NO TEMPLATE FOUND
    }
}

module.exports = {
    template_selector
}