const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));


const apiVersion = "2024-04";

/**
 * Fetches product information from a Shopify store.
 *
 * @async
 * @function getProductInfo
 * @param {string} productUrl - The URL of the product in the Shopify store.
 * @param {string} shopifyAccessToken - The access token for the Shopify API.
 * @returns {Promise<object>} A promise that resolves to the product data.
 * @throws {Error} Throws an error if the fetch operation fails or if the response is not OK.
 */
async function getProductInfo(productUrl, shopifyAccessToken) {
    try {
        const response = await fetch(productUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": shopifyAccessToken,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch product details");
        }

        const productData = await response.json();
        return productData.product;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Creates a draft order link for a Shopify product with a discount applied.
 *
 * @async
 * @function createDraftOrderLink
 * @param storeName - The name of the Shopify store (Prefix of the myshopify.com URL).
 * @param shopifyAccessToken - The access token for the Shopify API.
 * @param {number} productId - The ID of the product.
 * @param {string} discountType - The type of discount ("fixed_amount" or "percentage").
 * @param {number} discountRate - The rate of the discount.
 * @param {number} variantNumber - The variant number of the product.
 * @returns {Promise<string>} A promise that resolves to the invoice URL of the draft order.
 * @throws {Error} Throws an error if the product is not found or if the discount type is invalid.
 */
async function createDraftOrderLink(
    storeName,
    shopifyAccessToken,
    productId,
    discountType,
    discountRate,
    variantNumber,
) {
    const productUrl = `https://${storeName}.myshopify.com/admin/api/${apiVersion}/products/${productId}.json`;
    const product = await getProductInfo(productUrl, shopifyAccessToken);

    if (!product) {
        throw new Error("Product not found");
    }

    const variantID = product.variants[variantNumber].id;
    const productPrice = product.variants[variantNumber].price;

    let discountAmount;
    let discountDescription;

    if (discountType === "fixed-amount") {
        discountAmount = discountRate;
        discountDescription = "RFT Discount: -$" + discountAmount;
    } else if (discountType === "percentage") {
        discountAmount = (productPrice * discountRate) / 100;
        discountDescription = "RFT Discount: -" + discountRate + "%";
    } else {
        throw new Error("Invalid discount type");
    }

    const draftOrderPayload = {
        draft_order: {
            line_items: [
                {
                    product_id: productId,
                    variant_id: variantID,
                    quantity: 1,
                },
            ],
            applied_discount: {
                description: "Custom RFT Discount",
                value_type: discountType,
                value: discountRate.toString(),
                amount: parseFloat(discountAmount).toFixed(2),
                title: discountDescription,
            },
            use_customer_default_address: true,
        },
    };

    const draftOrderUrl = `https://${storeName}.myshopify.com/admin/api/${apiVersion}/draft_orders.json`;

    try {
        const response = await fetch(draftOrderUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": shopifyAccessToken,
            },
            body: JSON.stringify(draftOrderPayload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to create draft order: ${response.status} ${response.statusText}. ${errorText}`,
            );
        }

        const draftOrderData = await response.json();
        return draftOrderData.draft_order.invoice_url;
    } catch (error) {
        console.error(error);
        return `Error: ${error.message}`;
    }
}

async function getProducts(storeName, shopifyAccessToken) {
    const productUrl = `https://${storeName}.myshopify.com/admin/api/${apiVersion}/products.json`;

    const response = await fetch(productUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": shopifyAccessToken,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    return await response.json();
}

module.exports = getProducts;
