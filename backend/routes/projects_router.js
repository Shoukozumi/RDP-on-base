const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const project_router = express.Router();

const {template_selector} = require('../controller/action_template_controller');

const Projects = require('../models/project_model');
const Project_Apps = require('../models/project_app_connections_model');
const Project_First_Party_Action_Configs = require('../models/project_first_party_action_configs');
const Project_Actions = require('../models/project_actions_model');
const Project_Workflows = require('../models/project_workflows_model');
const Project_Refractors = require("../models/project_refractor_model");
const Project_First_Party_Action_Templates = require("../models/project_first_party_action_templates_model");

// Get list of projects for the user
router.get('/', async (req, res) => {
    try {
        const projects = await Projects.find({owner_id: req.user_id}).exec();
        const output = projects.map(record => ({
            project_id: record._id,
            project_name: record.project_name
        }));

        res.json(output);

    } catch (err) {
        res.status(500).json({message: err.message});
    }

});

// Create a new project
router.post('/add', async (req, res) => {
    try {
        const {project_name} = req.body;
        const new_project = new Projects({
            project_name,
            owner_id: req.user_id,
            project_actions: [],
            project_workflows: []
        });

        const saved_project = await new_project.save();

        // 1. populate Zapier
        const zapier_app = new Project_Apps({
            project_id: saved_project._id,
            owner_id: saved_project.owner_id,
            app_name: "Zapier",
            app_type: "Zapier",
            app_credentials: []
        })
        const saved_zapier_app = await zapier_app.save();
        await template_selector("Zapier").generate_and_save_FPAT("", req.user_id, saved_project._id, saved_zapier_app._id);

        // 2. populate Fleek
        const fleek_app = new Project_Apps({
            project_id: saved_project._id,
            owner_id: saved_project.owner_id,
            app_name: "Fleek",
            app_type: "Fleek",
            app_credentials: []
        })
        const saved_fleek_app = await fleek_app.save();
        await template_selector("Fleek").generate_and_save_FPAT("", req.user_id, saved_project._id, saved_fleek_app._id);
        // const FPATs = await app_template.get_FPATs(req.user_id, req.project_id, saved_app._id);

        return res.status(201).json({
            project_id: saved_project._id,
            project_name: saved_project.project_name
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Could not create project'});
    }
});


// Handler for specific projects
router.use('/:project_id', async (req, res, next) => {
    req.project_id = req.params.project_id;

    try {
        const doc = await Projects.findById(req.project_id).exec();
        console.log(doc);
        if (!doc || !doc.owner_id.equals(req.user_id)) {
            res.status(404);
        }
        next();

    } catch (err) {
        return res.status(500);
    }
}, project_router);

// Get project data
project_router.get('/', (req, res) => {
    const example_json = { // TODO: change to real json
        "project_name": "my super project",
        "owner_id": "60b8d6c5f1d1b3c6d7f1sd3b4",
        "project_actions": [
            {
                "action_id": "60b8d6c5f1d1b3c6d7f1sd3b4",
                "action_name": "Shopify product A coupon",
                "action_type": "Project_First_Party",

                "action_template_type": "Shopify::gift_card",
                "action_params": ["fixed", "", 5],
                "app_type": "Shopify",
                "rft_id": "0xabcdef"
            },
            {
                "action_id": "60b8d6c5f1d1b3c6d7f1sd3b4",
                "action_name": "Shopify product B coupon",
                "action_type": "Project_First_Party",

                "action_template_type": "Shopify::gift_card",
                "action_params": ["fixed", "", 5],
                "app_type": "Shopify",
                "rft_id": "0xabcdef"
            }
        ],
        "project_workflows": [
            {
                "workflow_name": "My workflow 1",
                "trigger_type": "time",
                "trigger_value": "0 0 0 0 0 *",
                "actions": {
                    "60b8d6c5f1d1b3c6d7f1sd3b4": 12,
                    "60b8d6c5f1d1b3c6d7f1ssdb4": 16
                },
                "destination_address": "0xabcdef"
            },
            {
                "workflow_name": "My workflow 2",
                "trigger_type": "event",
                "trigger_value": "0x0000::reload",
                "actions": {
                    "60b8d6c5f1d1b3c6d7f1sd3b4": 12,
                    "60b8d6c5f1d1b3c6d7f1ssdb4": 16
                },
                "destination_address": "0xabcdef"
            },
        ]
    }

    res.json(example_json);
});

// Update project name
project_router.post('/update', async (req, res) => {
    try {
        const {project_name} = req.body;

        const updated_project = await Projects.findByIdAndUpdate(
            req.project_id,
            {project_name: project_name},
            {new: true, select: '_id project_name'} // Return only _id and project_name
        ).exec();
        if (updated_project) {
            const response = {
                project_id: updated_project._id,
                project_name: updated_project.project_name
            };
            res.json(response);
        } else {
            res.status(404).json({message: 'Project not found'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Error updating project name', error});
    }
});

// Delete project
project_router.post('/delete', async (req, res) => {
    try {

        const record = await Projects.findById(req.project_id).exec();

        // Check if the app exists
        if (!record) {
            return res.status(404).json({message: 'Project not found'});
        }

        // Check if the owner_id matches req.user_id
        if (!record.owner_id.equals(req.user_id)) {
            return res.status(403).json({message: 'Unauthorized to delete this project!'});
        }

        const delete_project_records_operations = [
            Project_Actions.deleteMany({project_id: req.project_id}).exec(),
            Project_Workflows.deleteMany({project_id: req.project_id}).exec(),
            Project_Apps.deleteMany({project_id: req.project_id}).exec(),
            Project_First_Party_Action_Configs.deleteMany({project_id: req.project_id}).exec(),
            Project_Refractors.deleteMany({project_id: req.project_id}).exec(),
            Project_First_Party_Action_Templates.deleteMany({project_id: req.project_id}).exec(),
        ];

        // Delete the project and the related records in parallel
        await Promise.all([
            Projects.findByIdAndDelete(req.project_id).exec(),
            ...delete_project_records_operations
        ]);

        res.json({message: 'Project deleted successfully'});

    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Error deleting project'});
    }

});

// Get list of apps for a project
project_router.get('/apps', async (req, res) => {
    try {
        // Find records matching the owner_id
        const records = await Project_Apps.find({
            owner_id: req.user_id,
            project_id: req.project_id
        }, 'app_name app_type app_credentials').exec();

        // Format the records as JSON
        const formattedRecords = records.map(record => ({
            app_id: record._id,
            app_name: record.app_name,
            app_type: record.app_type,
            app_credentials: record.app_credentials
        }));

        // console.log(JSON.stringify(formattedRecords, null, 2));
        res.status(200).json(formattedRecords);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

// Register a new app with project
project_router.post('/apps/add', async (req, res) => {
    try {
        const {
            app_name,
            app_type,
            app_credentials
        } = req.body;

        console.log("app_name: ", app_name)
        console.log("app_type: ", app_type)
        console.log("app_credentials: ", app_credentials)

        const new_app = new Project_Apps({
            project_id: req.project_id,
            owner_id: req.user_id,
            app_name,
            app_type,
            app_credentials
        });
        const saved_app = await new_app.save();

        const app_template = template_selector(app_type);
        await app_template.generate_and_save_FPAT(app_credentials, req.user_id, req.project_id, saved_app._id);
        const FPATs = await app_template.get_FPATs(req.user_id, req.project_id, saved_app._id);
        console.log(FPATs)
        return res.status(201).json({message: 'success'});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Error creating app', error});
    }
});

// Delete app from project
project_router.post('/apps/delete', async (req, res) => {
    try {
        const {
            app_id
        } = req.body;

        const record = await Project_Apps.findById(app_id).exec();

        // Check if the app exists
        if (!record) {
            return res.status(404).json({message: 'App not found'});
        }

        // Check if the owner_id matches req.user_id
        if (!record.owner_id.equals(req.user_id)) {
            return res.status(403).json({message: 'Unauthorized to delete this app!'});
        }

        await Project_Apps.findByIdAndDelete(app_id).exec();
        await

            res.json({message: 'App deleted successfully'});

    } catch (error) {
        res.status(400).json({message: 'Error deleting app'});
    }
});

// Get list of available action templates for a project
project_router.get('/action_templates', async (req, res) => {
    try {
        const app_records = await Project_Apps.find({
            owner_id: req.user_id,
            project_id: req.project_id
        }, 'app_name app_type').exec();

        const app_actions = {
            "actions_list_digest": "",
            "first_party_apps": []
        };

        // Use map to create an array of promises
        const promises = app_records.map(async (record) => {
            const FPAT_json = await template_selector(record.app_type).get_FPATs(req.user_id, req.project_id, record._id);

            app_actions.first_party_apps.push({
                "app_name": record.app_name,
                "app_type": record.app_type,
                "app_config_id": record._id,
                "actions": FPAT_json
            });
        });

        // Wait for all promises to complete
        await Promise.all(promises);

        res.status(200).json(app_actions);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

module.exports = router;