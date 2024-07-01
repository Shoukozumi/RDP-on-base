const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));


const FPAT = require('../../models/project_first_party_action_templates_model');

const app_type = 'Fleek'
const action_templates_type = [
    "Fleek::function",
]

async function generate_and_save_FPAT(app_credentials, owner_id, project_id, app_id) {

    const FPAT_records = []

    const FPAT_record = {
        owner_id,
        project_id,
        app_id,
        app_type: app_type,
        action_template_name: `Execute a Fleek function`,
        action_template_type: "Fleek::function",
        action_template_metadata: {},
        action_template_description: "Create a execution token for a Fleek function. Users can burn the token to execute the function",
        action_template_thumbnail: "https://storageapi.fleek.one/fleek-team-bucket/site/fleek-footer.png",
        action_template_inputs: [
            {
                "input_name": "Input the Fleek function link",
                "input_description": "You can create a Fleek function link by <a href='https://fleek.xyz/'> following this guide </a>",
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