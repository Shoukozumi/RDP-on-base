const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));


const FPAT = require('../../models/project_first_party_action_templates_model');

const app_type = 'Zapier'
const action_templates_type = [
    "Zapier::zap",
]

async function generate_and_save_FPAT(app_credentials, owner_id, project_id, app_id) {

    const FPAT_records = []

    const FPAT_record = {
        owner_id,
        project_id,
        app_id,
        app_type: app_type,
        action_template_name: `Execute a Zapier Zap`,
        action_template_type: "Fleek::function",
        action_template_metadata: {},
        action_template_description: "Create a execution token for a Zapier Zap. Users can burn the token to trigger the Zap",
        action_template_thumbnail: "https://cdn.prod.website-files.com/5c06e16a5bdc7bce10059cc3/636fd0c6aa7ce42754d7b04e_J2IQV1CSzFQhv4zdtIXCPE22y7ihgGl7obTul7Sj8Jk.png",
        action_template_inputs: [
            {
                "input_name": "Input the Zapier Zap link",
                "input_description": "You can create a Zapier zap by <a href='https://help.zapier.com/hc/en-us/articles/8496309697421-Create-Zaps'> following this guide </a>",
                "input_type": "string",
                "input_choice_children": []
            }
        ]
    }
    FPAT_records.push(FPAT_record);

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