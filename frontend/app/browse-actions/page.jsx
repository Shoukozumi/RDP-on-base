'use client'

import {useState, useEffect, useRef} from 'react'
import Sidebar from "@/app/sidebar"
import Image from 'next/image'
import {FaEye} from 'react-icons/fa';
import Cookies from "js-cookie";
import {router} from "next/client";
import {useRouter} from "next/navigation";

require("dotenv").config();

const platforms = {
    "Shopify": {
        name: "Shopify",
        thumbnail: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ffreelogopng.com%2Fimages%2Fall_img%2F1655837490shopify-png-logo.png&f=1&nofb=1&ipt=fd5767dd7a7b4c374787e682128dc85baacf774844bfe18ecd48ebbabd65d2f6&ipo=images"
    },
    "Tremendous": {
        name: "Tremendous",
        thumbnail: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.datocms-assets.com%2F85985%2F1679494764-tremendous-gift-card-tremendous.png&f=1&nofb=1&ipt=fe5bd98a3c76ff63ad4d1cbfc50e40f7ff0d7f0ea0d9cd11f3385098a905916a&ipo=images"
    },
    "Fleek": {
        name: "Fleek",
        thumbnail: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffleek-team-bucket.storage.fleek.co%2FFleekIntro.jpg&f=1&nofb=1&ipt=4ccbd4695705da8b809de432d2b3633e54384c9e451cce016c1c6013d3147f56&ipo=images"
    },
    "Zapier": {
        name: "Zapier",
        thumbnail: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fclipground.com%2Fimages%2Fzapier-logo-3.png&f=1&nofb=1&ipt=a69dfaf4a7fe65f1e3fcdbeab2e2e8c30f11021b04fb0522f8f3ba828c295217&ipo=images"
    }
};


const thirdPartyActions = {
    "platforms": [
        {
            "platform_name": "Shopify",
            "creators": [
                {
                    "creator_id": "0x1234beef",
                    "creator_name": "SuperShopifyStore",
                    "security_stake": 30000,
                    "refractor": "SuperShopifyStore_Server",
                    "stores": [
                        {
                            "store_name": "My Shoe Store",
                            "actions": [
                                {
                                    "action_name": "Redeem Back to the Future Shoes",
                                    "action_description": "Creates a new order of these futuristic shoes for free when you redeem it",
                                    "action_icon": "/images/back-to-future-shoes.jpg",
                                    "action_metadata": {
                                        "shopify_product_name": "Back to the Future Shoes",
                                        "shopify_product_price": 41999
                                    },
                                    "unitprice_usd": 60,
                                    "availability": "unlimited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "discount_type": "percentage",
                                        "discount_amount": "100"
                                    }
                                },
                                {
                                    "action_name": "Generate AJ 1 OG Retro High Discount",
                                    "action_description": "Generates a 30% discount code for AJ 1 OG Retro High",
                                    "action_icon": "/images/aj1-og-retro-high.jpg",
                                    "action_metadata": {
                                        "shopify_product_name": "AJ 1 OG Retro High",
                                        "shopify_product_price": 1999
                                    },
                                    "unitprice_usd": 15,
                                    "availability": "limited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "discount_type": "percentage",
                                        "discount_amount": "30"
                                    }
                                },
                                {
                                    "action_name": "Redeem Ultra Boost DNA Shoes",
                                    "action_description": "Creates a new order of Ultra Boost DNA shoes with a 50% discount",
                                    "action_icon": "/images/ultra-boost-dna.jpg",
                                    "action_metadata": {
                                        "shopify_product_name": "Ultra Boost DNA",
                                        "shopify_product_price": 18000
                                    },
                                    "unitprice_usd": 45,
                                    "availability": "limited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "discount_type": "percentage",
                                        "discount_amount": "50"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "creator_id": "0x124beef",
                    "creator_name": "Creator 2",
                    "security_stake": 30000,
                    "refractor": "SuperShopifyStore_Server",
                    "stores": [
                        {
                            "store_name": "My Shoe Store",
                            "actions": [
                                {
                                    "action_name": "Redeem Back to the Future Shoes",
                                    "action_description": "Creates a new order of these futuristic shoes for free when you redeem it",
                                    "action_icon": "/images/back-to-future-shoes.jpg",
                                    "action_metadata": {
                                        "shopify_product_name": "Back to the Future Shoes",
                                        "shopify_product_price": 41999
                                    },
                                    "unitprice_usd": 60,
                                    "availability": "unlimited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "discount_type": "percentage",
                                        "discount_amount": "100"
                                    }
                                },
                                {
                                    "action_name": "Generate AJ 1 OG Retro High Discount",
                                    "action_description": "Generates a 30% discount code for AJ 1 OG Retro High",
                                    "action_icon": "/images/aj1-og-retro-high.jpg",
                                    "action_metadata": {
                                        "shopify_product_name": "AJ 1 OG Retro High",
                                        "shopify_product_price": 1999
                                    },
                                    "unitprice_usd": 15,
                                    "availability": "limited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "discount_type": "percentage",
                                        "discount_amount": "30"
                                    }
                                },
                                {
                                    "action_name": "Redeem Ultra Boost DNA Shoes",
                                    "action_description": "Creates a new order of Ultra Boost DNA shoes with a 50% discount",
                                    "action_icon": "/images/ultra-boost-dna.jpg",
                                    "action_metadata": {
                                        "shopify_product_name": "Ultra Boost DNA",
                                        "shopify_product_price": 18000
                                    },
                                    "unitprice_usd": 45,
                                    "availability": "limited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "discount_type": "percentage",
                                        "discount_amount": "50"
                                    }
                                }
                            ]
                        },
                        {
                            "store_name": "My Shoe Store B",
                            "actions": [
                                {
                                    "action_name": "Redeem Back to the Future Shoes",
                                    "action_description": "Creates a new order of these futuristic shoes for free when you redeem it",
                                    "action_icon": "/images/back-to-future-shoes.jpg",
                                    "action_metadata": {
                                        "shopify_product_name": "Back to the Future Shoes",
                                        "shopify_product_price": 41999
                                    },
                                    "unitprice_usd": 60,
                                    "availability": "unlimited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "discount_type": "percentage",
                                        "discount_amount": "100"
                                    }
                                },
                                {
                                    "action_name": "Generate AJ 1 OG Retro High Discount",
                                    "action_description": "Generates a 30% discount code for AJ 1 OG Retro High",
                                    "action_icon": "/images/aj1-og-retro-high.jpg",
                                    "action_metadata": {
                                        "shopify_product_name": "AJ 1 OG Retro High",
                                        "shopify_product_price": 1999
                                    },
                                    "unitprice_usd": 15,
                                    "availability": "limited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "discount_type": "percentage",
                                        "discount_amount": "30"
                                    }
                                },
                                {
                                    "action_name": "Redeem Ultra Boost DNA Shoes",
                                    "action_description": "Creates a new order of Ultra Boost DNA shoes with a 50% discount",
                                    "action_icon": "/images/ultra-boost-dna.jpg",
                                    "action_metadata": {
                                        "shopify_product_name": "Ultra Boost DNA",
                                        "shopify_product_price": 18000
                                    },
                                    "unitprice_usd": 45,
                                    "availability": "limited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "discount_type": "percentage",
                                        "discount_amount": "50"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "platform_name": "Tremendous",
            "creators": [
                {
                    "creator_id": "0x5678abcd",
                    "creator_name": "SuperGiftcardStore",
                    "security_stake": 50000,
                    "refractor": "SuperGiftcardStore_Server",
                    "stores": [
                        {
                            "store_name": "Gift Card Shop",
                            "actions": [
                                {
                                    "action_name": "Redeem Apple Gift Card",
                                    "action_description": "Issues a $100 Apple gift card when redeemed",
                                    "action_icon": "/images/apple-gift-card.jpg",
                                    "action_metadata": {
                                        "tremendous_product_type": "Apple"
                                    },
                                    "unitprice_usd": 100,
                                    "availability": "unlimited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "product_id": "AGC001",
                                        "card_value": 100
                                    }
                                },
                                {
                                    "action_name": "Redeem Amazon Gift Card",
                                    "action_description": "Issues a $50 Amazon gift card when redeemed",
                                    "action_icon": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.1zYILHfqT1_VD7YVJVZB8gHaHa%26pid%3DApi&f=1&ipt=4af25fa5eb76fbf82a9a7baa8c205607ae7ebaca01dc8c326e8f7154f8a9ad12&ipo=images",
                                    "action_metadata": {
                                        "tremendous_product_type": "Amazon"
                                    },
                                    "unitprice_usd": 50,
                                    "availability": "unlimited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "product_id": "AMGC002",
                                        "card_value": 50
                                    }
                                },
                                {
                                    "action_name": "Redeem Starbucks Gift Card",
                                    "action_description": "Issues a $25 Starbucks gift card when redeemed",
                                    "action_icon": "/images/starbucks-gift-card.jpg",
                                    "action_metadata": {
                                        "tremendous_product_type": "Starbucks"
                                    },
                                    "unitprice_usd": 25,
                                    "availability": "limited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "product_id": "SBGC003",
                                        "card_value": 25
                                    }
                                },
                                {
                                    "action_name": "Redeem Netflix Gift Card",
                                    "action_description": "Issues a $30 Netflix gift card when redeemed",
                                    "action_icon": "/images/netflix-gift-card.jpg",
                                    "action_metadata": {
                                        "tremendous_product_type": "Netflix"
                                    },
                                    "unitprice_usd": 30,
                                    "availability": "unlimited",
                                    "protocol": "standard_data_schema",
                                    "action_params": {
                                        "product_id": "NFGC004",
                                        "card_value": 30
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}


export default function BrowseActions() {
    const router = useRouter();
    // Get the JWT token from local storage

    const [jwtToken, setJwtToken] = useState(null);
    // const url = process.env.BACKEND_URL;
    const url = 'https://95d4-99-66-223-236.ngrok-free.app'

    const [activeItem, setActiveItem] = useState(null)
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
    const [selectedAction, setSelectedAction] = useState(null)
    const [actionConfig, setActionConfig] = useState({})
    const itemRefs = useRef({})

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedActionDetails, setSelectedActionDetails] = useState(null);
    const [actionLimits, setActionLimits] = useState({});
    const [firstPartyActions, setFirstPartyActions] = useState({first_party_apps: []});

    const [isShopifyModalOpen, setIsShopifyModalOpen] = useState(false);
    const [isTremendousModalOpen, setIsTremendousModalOpen] = useState(false);
    const [shopName, setShopName] = useState('');
    const [tremendousApiKey, setTremendousApiKey] = useState('');

    const project_id = Cookies.get("currentProjectId");

    // Action Parameters
    const [paramChoices, setParamChoices] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                router.push('/');
                return;
            }
            setJwtToken(token)

            const project_id = Cookies.get("currentProjectId");

            try {
                const response = await fetch(`http://localhost:3000/projects/${project_id}/action_templates`, {
                    method: 'GET',
                    headers: {
                        "ngrok-skip-browser-warning": "69420",
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setFirstPartyActions(data);
            } catch (error) {
                console.error('Error fetching first party actions:', error);
                // Set a default value or show an error message to the user
            }
        };

        fetchData();
    }, [router]);

    // Shopify and Tremendous installation
    const handleShopifyInstall = (e) => {
        e.preventDefault();
        console.log("Installing Shopify app for shop_name:", shopName);

        if (!shopName) {
            alert('Please enter your shop_name URL');
            return;
        }

        const installURL = `${url}/shopify/install?shop=${shopName}`;
        console.log(installURL);

        console.log(jwtToken)

        fetch(installURL, {
            method: 'GET',
            headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
                "Authorization": `Bearer ${jwtToken}`, // Add the JWT token to the Authorization header
            })
        })
            .then(response => response.json())
            .then(data => {
                // Append the state to the installation URL
                console.log(data);
                window.location.href = `${data.installUrl}&state=${data.state}`;
            })
            .catch(error => {
                console.error('Error fetching install URL:', error);
            });

        setIsShopifyModalOpen(false);
        setShopName('');
    };

    const handleTremendousInstall = async (e) => {
        e.preventDefault();
        console.log("Installing Tremendous app with API key:", tremendousApiKey);

        try {
            const response = await fetch(`http://localhost:3000/projects/${project_id}/apps/add`, {
                method: 'POST',
                headers: {
                    "ngrok-skip-browser-warning": "69420",
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    app_name: 'Tremendous',
                    app_type: 'Tremendous',
                    app_credentials: tremendousApiKey
                })
            });
            const data = await response.json();
            console.log(data)
            console.log(response)
        } catch (error) {
            console.error('Error installing Tremendous app:', error);
        }


        setIsTremendousModalOpen(false);
        setTremendousApiKey('');
    };


    const handleViewDetails = (action) => {
        setSelectedActionDetails(action);
        setDetailsModalOpen(true);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2

            for (let itemId in itemRefs.current) {
                const element = itemRefs.current[itemId]
                if (element) {
                    const {offsetTop, offsetHeight} = element
                    if (scrollPosition > offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveItem(itemId)
                        return
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToItem = (itemId) => {
        const element = itemRefs.current[itemId]
        if (element) {
            element.scrollIntoView({behavior: 'smooth'})
        }
    }


    const handleConfigModalClose = () => {
        setIsConfigModalOpen(false)
        setSelectedAction(null)
        setActionConfig({})
    }


    useEffect(() => {
        if (selectedAction && selectedAction.action_template_params) {
            setParamChoices({});
        }
    }, [selectedAction]);


    const handleInputChange = (paramName, value) => {
        setParamChoices(prev => ({
            ...prev,
            [paramName]: value
        }));
    };


    const renderInputField = (param) => {
        switch (param.input_type) {
            case 'single-select':
                return (
                    <select
                        className="select select-bordered"
                        value={paramChoices[param.input_name] || ""}
                        onChange={(e) => handleInputChange(param.input_name, e.target.value)}
                    >
                        <option value="" disabled>Select an option</option>
                        {param.input_choices.map((choice, i) => (
                            <option key={i} value={choice}>{choice}</option>
                        ))}
                    </select>
                );
            case 'percentage':
                return (
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            placeholder={`Enter ${param.input_type} (0-100)`}
                            className="input input-bordered"
                            value={paramChoices[param.input_name] || ""}
                            onChange={(e) => {
                                const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                handleInputChange(param.input_name, value.toString());
                            }}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
                    </div>
                );

            case 'string':
                return (
                    <input
                        type="url"
                        placeholder="Enter URL"
                        className="input input-bordered"
                        value={paramChoices[param.input_name] || ""}
                        onChange={(e) => handleInputChange(param.input_name, e.target.value)}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        placeholder={`Enter ${param.input_type}`}
                        className="input input-bordered"
                        value={paramChoices[param.input_name] || ""}
                        onChange={(e) => handleInputChange(param.input_name, e.target.value)}
                    />
                );
            default:
                return null;
        }
    };


    const renderChildParam = (parentParam, selectedChoice) => {
        if (parentParam.input_choices && Array.isArray(parentParam.input_choices)) {
            const childIndex = parentParam.input_choices.indexOf(selectedChoice);
            if (childIndex !== -1 && parentParam.input_choice_children && parentParam.input_choice_children[childIndex]) {
                const childParam = parentParam.input_choice_children[childIndex];
                return (
                    <div className="form-control mt-2">
                        <label className="label">
                            <span className="label-text">{childParam.input_name}</span>
                        </label>
                        {renderInputField(childParam)}
                    </div>
                );
            }
        }
        return null;
    };

    const renderParams = (params) => {
        return params.map((param, index) => {
            return (
                <div key={param.input_name} className="form-control">
                    <label className="label">
                        <span className="label-text">{param.input_name}</span>
                    </label>
                    {renderInputField(param)}
                    {param.input_choice_children && paramChoices[param.input_name] &&
                        renderChildParam(param, paramChoices[param.input_name])}
                </div>
            );
        });
    };

    const handleAddFirstPartyActionToProject = () => {
        console.log("Adding action to project:", selectedAction);

        let selectedActions = [];
        try {
            const existingActions = localStorage.getItem("selectedActions");
            if (existingActions) {
                selectedActions = JSON.parse(existingActions);
            }
        } catch (error) {
            console.error("Error parsing existing actions:", error);
            localStorage.removeItem("selectedActions");
        }

        const newAction = {
            action: {
                action_name: selectedAction.action_name,
                action_description: selectedAction.action_description,
                action_icon: selectedAction.action_icon,
                action_metadata: selectedAction.action_metadata || {},
                action_template_type: selectedAction.action_template_type,
                action_template_params: selectedAction.action_template_params,
                app_type: selectedAction.app_type,
                app_id: selectedAction.app_id,
                rft_id: selectedAction.rft_id
            },
            customName: paramChoices.customName,
            action_params: paramChoices
        };

        console.log("New action to add:", newAction);
        selectedActions.push(newAction);

        try {
            localStorage.setItem("selectedActions", JSON.stringify(selectedActions));
            console.log("Actions stored successfully");

            // Verify storage
            const verifiedActions = localStorage.getItem("selectedActions");
            console.log("Verified stored actions:", JSON.parse(verifiedActions));
        } catch (error) {
            console.error("Error storing actions:", error);
        }

        handleConfigModalClose();
    };


    const handleAddThirdPartyActionToProject = (action) => {
        setSelectedAction(action);
        setParamChoices([]);  // Reset choices when opening the modal
        setIsConfigModalOpen(true);
    };

    // Loading spinner until data is fetched
    if (!firstPartyActions) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
            </div>
        );
    }


    return (

        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle"/>
            <div className="drawer-content flex flex-row">
                {/* Main content */}
                <div className="flex-grow p-8 pr-72 overflow-y-auto">
                    <h1 className="text-3xl font-bold mb-8">Browse Actions</h1>


                    {/* First-party actions */}
                    <h2 className="text-2xl font-semibold mb-6">Your Actions</h2>
                    {['Shopify', 'Tremendous', 'Fleek', 'Zapier'].map((platform) => {
                        const apps = firstPartyActions.first_party_apps.filter(app => app.app_type === platform) || [];
                        return (
                            <div key={platform} className="mb-12">
                                <h3 className="text-xl font-semibold mb-4">{platform}</h3>
                                {apps.length > 0 ? apps.map((app) => {
                                    const actionsToShow = actionLimits[app.app_config_id] || 10;
                                    const hasMoreActions = app.actions.length > actionsToShow;

                                    return (
                                        <div
                                            key={app.app_config_id}
                                            id={app.app_config_id}
                                            className="card bg-base-100 shadow-xl mb-8"
                                            ref={(el) => itemRefs.current[app.app_config_id] = el}
                                        >
                                            <div className="card-body">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center">
                                                        <Image
                                                            src={platforms[platform].thumbnail}
                                                            alt={`${platform} logo`}
                                                            width={40}
                                                            height={40}
                                                            className="mr-4"
                                                        />
                                                        <h4 className="text-lg font-medium">{app.app_name}</h4>
                                                    </div>

                                                    {platform === 'Shopify' && (
                                                        <button className="btn btn-primary btn-sm"
                                                                onClick={() => setIsShopifyModalOpen(true)}>Add Another
                                                            Store</button>
                                                    )}
                                                    {platform === 'Tremendous' && (
                                                        <button className="btn btn-primary btn-sm"
                                                                onClick={() => setIsTremendousModalOpen(true)}>Add
                                                            Another Store</button>
                                                    )}
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="table w-full">
                                                        <thead>
                                                        <tr>
                                                            <th className="w-20">Thumbnail</th>
                                                            <th className="w-48">Name</th>
                                                            <th className="w-96">Description</th>
                                                            <th className="w-36">Actions</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {app.actions.slice(0, actionsToShow).map((action) => (
                                                            <tr key={action.action_name}>
                                                                <td>
                                                                    <Image
                                                                        src={action.action_icon}
                                                                        alt={action.action_name}
                                                                        width={50}
                                                                        height={50}
                                                                        className="rounded-xl"
                                                                    />
                                                                </td>
                                                                <td className="whitespace-normal break-words">{action.action_name}</td>
                                                                <td className="whitespace-normal break-words">{action.action_description}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-primary btn-sm"
                                                                        onClick={() => handleAddThirdPartyActionToProject(action)}
                                                                    >
                                                                        Add to Project
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {hasMoreActions && (
                                                    <div className="text-center mt-4">
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => {
                                                                setActionLimits(prev => ({
                                                                    ...prev,
                                                                    [app.app_config_id]: (prev[app.app_config_id] || 10) + 10
                                                                }));
                                                            }}
                                                        >
                                                            Load More Actions
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="card bg-base-100 shadow-xl mb-8">
                                        <div className="card-body">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <Image
                                                        src={platforms[platform].thumbnail}
                                                        alt={`${platform} logo`}
                                                        width={40}
                                                        height={40}
                                                        className="mr-4"
                                                    />
                                                    <h4 className="text-lg font-medium">No stores connected</h4>
                                                </div>
                                                {platform === 'Shopify' && (
                                                    <button className="btn btn-primary btn-sm"
                                                            onClick={() => setIsShopifyModalOpen(true)}>Add
                                                        Store</button>
                                                )}
                                                {platform === 'Tremendous' && (
                                                    <button className="btn btn-primary btn-sm"
                                                            onClick={() => setIsTremendousModalOpen(true)}>Add
                                                        Store</button>
                                                )}
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="table w-full">
                                                    <thead>
                                                    <tr>
                                                        <th className="w-20">Thumbnail</th>
                                                        <th className="w-48">Name</th>
                                                        <th className="w-96">Description</th>
                                                        <th className="w-36">Actions</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr className="opacity-50">
                                                        <td>
                                                            <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                                                        </td>
                                                        <td className="whitespace-normal break-words">Dummy Action</td>
                                                        <td className="whitespace-normal break-words">This is a
                                                            placeholder for a sample action
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-primary btn-sm" disabled>
                                                                Add to Project
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}


                    <h2 className="text-2xl font-semibold mb-6 mt-12">Third-Party Actions</h2>
                    {thirdPartyActions.platforms.map((platform) => (
                        <div key={platform.platform_name} className="mb-12">
                            <h3 className="text-xl font-semibold mb-4">{platform.platform_name}</h3>
                            {platform.creators.map((creator) => (
                                <div
                                    key={creator.creator_id}
                                    ref={(el) => itemRefs.current[`${platform.platform_name}-${creator.creator_id}`] = el}
                                    className="card bg-base-100 shadow-xl mb-8"
                                >
                                    <div className="card-body">
                                        <h4 className="card-title">{creator.creator_name}</h4>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <div className="badge badge-secondary">Security Stake:
                                                ${creator.security_stake}</div>
                                            <div className="badge badge-outline">Refractor: {creator.refractor}</div>
                                        </div>
                                        {creator.stores.map((store) => (
                                            <div key={store.store_name}
                                                 className="collapse collapse-open bg-base-200 mb-4">
                                                <input type="checkbox" className="peer"/>
                                                <div className="collapse-title flex items-center p-4">
                                                    <Image
                                                        src={platforms[platform.platform_name].thumbnail}
                                                        alt={`${platform.platform_name} logo`}
                                                        width={30}
                                                        height={30}
                                                        className="mr-3"
                                                    />
                                                    <span className="text-lg font-semibold">{store.store_name}</span>
                                                </div>
                                                <div className="collapse-content">
                                                    <div className="overflow-x-auto">
                                                        <table className="table w-full">
                                                            <thead>
                                                            <tr>
                                                                <th className="w-20">Thumbnail</th>
                                                                <th className="w-48">Name</th>
                                                                <th className="w-96">Description</th>
                                                                <th className="w-16">Price</th>
                                                                <th className="w-48">Actions</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {store.actions.map((action) => (
                                                                <tr key={action.action_name}>
                                                                    <td>
                                                                        <div className="avatar">
                                                                            <div className="w-12 h-12 rounded-xl">
                                                                                <Image
                                                                                    src={action.action_icon}
                                                                                    alt={action.action_name}
                                                                                    width={50}
                                                                                    height={50}
                                                                                    layout="responsive"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="whitespace-normal break-words">{action.action_name}</td>
                                                                    <td className="whitespace-normal break-words">{action.action_description}</td>
                                                                    <td>${action.unitprice_usd}</td>
                                                                    <td>
                                                                        <div
                                                                            className="flex flex-nowrap items-center gap-2">
                                                                            <button
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => handleViewDetails(action)}
                                                                            >
                                                                                <FaEye/>
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => handleAddThirdPartyActionToProject(action)}
                                                                            >
                                                                                Add to Project
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                </div>


                {/* Secondary sidebar */}
                <div className="w-64 bg-base-200 p-4 overflow-y-auto fixed right-0 top-0 bottom-0 lg:block hidden">
                    <h2 className="text-xl font-semibold mb-4">Actions</h2>

                    <h3 className="text-lg font-medium mb-2">First-Party Actions</h3>
                    <ul>
                        {firstPartyActions.first_party_apps.map((app) => (
                            <li
                                key={app.app_config_id}
                                className={`cursor-pointer hover:text-primary mb-2 ${activeItem === app.app_config_id ? 'text-primary font-semibold' : ''}`}
                                onClick={() => scrollToItem(app.app_config_id)}
                            >
                                {app.app_type} - {app.app_name}
                            </li>
                        ))}
                    </ul>
                    <h3 className="text-lg font-medium mb-2">Third-Party Actions</h3>
                    <ul>
                        {thirdPartyActions.platforms.map((platform) => (
                            <li key={platform.platform_name} className="mb-2">
                                <span className="font-medium">{platform.platform_name}</span>
                                <ul className="ml-4 mt-1">
                                    {platform.creators.map((creator) => (
                                        <li
                                            key={creator.creator_id}
                                            className={`cursor-pointer hover:text-primary ${activeItem === `${platform.platform_name}-${creator.creator_id}` ? 'text-primary font-semibold' : ''}`}
                                            onClick={() => scrollToItem(`${platform.platform_name}-${creator.creator_id}`)}
                                        >
                                            {creator.creator_name}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Sidebar/>

            {/* Modal for action details */}
            {detailsModalOpen && selectedActionDetails && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{selectedActionDetails.action_name}</h3>
                        <p className="py-4">{selectedActionDetails.action_description}</p>
                        <p>Price: ${selectedActionDetails.unitprice_usd}</p>
                        <p>Availability: {selectedActionDetails.availability}</p>
                        <p>Protocol: {selectedActionDetails.protocol}</p>
                        <div className="mt-2">
                            <h4 className="font-semibold">Action Metadata:</h4>
                            {selectedActionDetails.action_metadata && Object.keys(selectedActionDetails.action_metadata).length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {Object.entries(selectedActionDetails.action_metadata).map(([key, value]) => (
                                        <li key={key}>{key}: {value}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No action metadata available</p>
                            )}
                        </div>
                        <div className="mt-2">
                            <h4 className="font-semibold">Action Params:</h4>
                            {selectedActionDetails.action_params && Object.keys(selectedActionDetails.action_params).length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {Object.entries(selectedActionDetails.action_params).map(([key, value]) => (
                                        <li key={key}>{key}: {value}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No action params available</p>
                            )}
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setDetailsModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}


            {/*In the modal for first-party action configuration*/}
            {isConfigModalOpen && selectedAction && selectedAction.action_template_params && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{selectedAction.action_name}</h3>
                        <p className="py-4">{selectedAction.action_description}</p>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Custom Action Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter custom name for this action"
                                className="input input-bordered"
                                value={paramChoices.customName || ""}
                                onChange={(e) => handleInputChange("customName", e.target.value)}
                            />
                        </div>
                        {renderParams(selectedAction.action_template_params)}
                        <div className="modal-action">
                            <button className="btn" onClick={handleConfigModalClose}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddFirstPartyActionToProject}>
                                Add to Project
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Shopify Install Modal */}
            {isShopifyModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Install Shopify App</h3>
                        <form onSubmit={handleShopifyInstall}>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Shop Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    placeholder="your-shop_name-app_name"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn"
                                        onClick={() => setIsShopifyModalOpen(false)}>Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">Install App</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tremendous Install Modal */}
            {isTremendousModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Install Tremendous App</h3>
                        <form onSubmit={handleTremendousInstall}>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">API Key</span>
                                </label>
                                <input
                                    type="text"
                                    value={tremendousApiKey}
                                    onChange={(e) => setTremendousApiKey(e.target.value)}
                                    placeholder="Enter your Tremendous API key"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn"
                                        onClick={() => setIsTremendousModalOpen(false)}>Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">Install App</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
