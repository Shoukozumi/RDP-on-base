'use client'

import {useEffect, useState} from 'react'
import Sidebar from "@/app/sidebar"
import Link from "next/link";
import Image from 'next/image';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ordinals = ['first', 'second', 'third', 'fourth', 'last'];

const triggerOptions = [
    {id: 'time', name: 'Time', description: 'Set a Trigger base on time'},
    {id: 'onchain', name: 'On-chain Event', description: 'Triggered by On-chain Event'},
    {id: 'manual', name: 'Manual', description: 'Manual Set up your Trigger'},
    {id: 'webhook', name: 'Web Hook', description: 'Webhook trigger Selected Action'},
]

const timeOptions = [
    {id: 'daily', name: 'Every day'},
    {id: 'weekly', name: 'Every week'},
    {id: 'monthly', name: 'Every month'},
]

const actionData = {
    "stores": [
        {
            "storeInfo": {
                "storeType": "shopify",
                "storeName": "My Shoe Store"
            },
            "actions": [
                {
                    "actionName": "Redeem this pair of shoes",
                    "description": "Creates a new order of this pair of shoes for free when you redeem it",
                    "platform": "Shopify",
                    "creatorId": "0x1234beef",
                    "creatorName": "SuperShopifyStore",
                    "refractor": "SuperShopifyStore_Server",
                    "securityStake": 30000,
                    "unitPriceUSD": 60,
                    "availability": "unlimited",
                    "protocol": "standard data schema",
                    "metadata": {
                        "productId": "SHOE001",
                        "size": "All",
                        "color": "Various"
                    }
                },
                {
                    "actionName": "20% Off Coupon",
                    "description": "Generates a one-time use coupon for 20% off any purchase",
                    "platform": "Shopify",
                    "creatorId": "0x1234beef",
                    "creatorName": "SuperShopifyStore",
                    "refractor": "SuperShopifyStore_Server",
                    "securityStake": 15000,
                    "unitPriceUSD": 10,
                    "availability": "limited",
                    "protocol": "standard data schema",
                    "metadata": {
                        "discountType": "percentage",
                        "discountValue": 20,
                        "expirationDays": 30
                    }
                }
            ]
        },
        {
            "storeInfo": {
                "storeType": "shopify",
                "storeName": "Tech Gadgets R Us"
            },
            "actions": [
                {
                    "actionName": "Free Smartphone Case",
                    "description": "Adds a free smartphone case to the user's next order",
                    "platform": "Shopify",
                    "creatorId": "0x5678abcd",
                    "creatorName": "GadgetMaster",
                    "refractor": "GadgetMaster_Server",
                    "securityStake": 20000,
                    "unitPriceUSD": 15,
                    "availability": "unlimited",
                    "protocol": "standard data schema",
                    "metadata": {
                        "productId": "CASE001",
                        "compatibility": "Universal"
                    }
                },
                {
                    "actionName": "Priority Shipping Upgrade",
                    "description": "Upgrades the shipping method to priority for the next order",
                    "platform": "Shopify",
                    "creatorId": "0x5678abcd",
                    "creatorName": "GadgetMaster",
                    "refractor": "GadgetMaster_Server",
                    "securityStake": 10000,
                    "unitPriceUSD": 8,
                    "availability": "unlimited",
                    "protocol": "standard data schema",
                    "metadata": {
                        "shippingMethod": "Priority",
                        "validDays": 14
                    }
                }
            ]
        },
        {
            "storeInfo": {
                "storeType": "tremendous",
                "storeName": "Happy Gift Cards"
            },
            "actions": [
                {
                    "actionName": "$50 Amazon Gift Card",
                    "description": "Sends a $50 Amazon gift card to the user",
                    "platform": "Tremendous",
                    "creatorId": "0x9876fedc",
                    "creatorName": "GiftCardKing",
                    "refractor": "GiftCardKing_Server",
                    "securityStake": 50000,
                    "unitPriceUSD": 52,
                    "availability": "unlimited",
                    "protocol": "standard data schema",
                    "metadata": {
                        "giftCardType": "Amazon",
                        "value": 50,
                        "currency": "USD"
                    }
                },
                {
                    "actionName": "$25 Starbucks Gift Card",
                    "description": "Sends a $25 Starbucks gift card to the user",
                    "platform": "Tremendous",
                    "creatorId": "0x9876fedc",
                    "creatorName": "GiftCardKing",
                    "refractor": "GiftCardKing_Server",
                    "securityStake": 25000,
                    "unitPriceUSD": 26,
                    "availability": "limited",
                    "protocol": "standard data schema",
                    "metadata": {
                        "giftCardType": "Starbucks",
                        "value": 25,
                        "currency": "USD"
                    }
                }
            ]
        },
        {
            "storeInfo": {
                "storeType": "zapier",
                "storeName": "AutoTask Automations"
            },
            "actions": [
                {
                    "actionName": "Create Trello Card",
                    "description": "Creates a new card in a specified Trello board",
                    "platform": "Zapier",
                    "creatorId": "0xaabbccdd",
                    "creatorName": "ZapMaster",
                    "refractor": "ZapMaster_Server",
                    "securityStake": 5000,
                    "unitPriceUSD": 0.5,
                    "availability": "unlimited",
                    "protocol": "standard data schema",
                    "metadata": {
                        "boardId": "TrelloBoard123",
                        "listName": "To Do"
                    }
                },
                {
                    "actionName": "Send Slack Message",
                    "description": "Sends a customized message to a Slack channel",
                    "platform": "Zapier",
                    "creatorId": "0xaabbccdd",
                    "creatorName": "ZapMaster",
                    "refractor": "ZapMaster_Server",
                    "securityStake": 5000,
                    "unitPriceUSD": 0.3,
                    "availability": "unlimited",
                    "protocol": "standard data schema",
                    "metadata": {
                        "channelId": "SlackChannel456",
                        "messageTemplate": "New task: {{taskName}}"
                    }
                }
            ]
        }
    ]
};

export default function CreateWorkflow() {
    const [title, setTitle] = useState('')
    const [selectedTrigger, setSelectedTrigger] = useState(null)
    const [timeOption, setTimeOption] = useState(null)
    const [timeValue, setTimeValue] = useState('')
    const [onchainAddress, setOnchainAddress] = useState('')
    const [onchainEvent, setOnchainEvent] = useState('')
    const [webhookParams, setWebhookParams] = useState('')
    const [isActionModalOpen, setIsActionModalOpen] = useState(false)
    const [selectedActions, setSelectedActions] = useState([])

    const [timeFrequency, setTimeFrequency] = useState('daily')
    const [timePeriod, setTimePeriod] = useState(1)
    const [selectedDays, setSelectedDays] = useState([])
    const [selectedMonths, setSelectedMonths] = useState([])
    const [monthDay, setMonthDay] = useState(1)
    const [ordinalDay, setOrdinalDay] = useState('') // Default to select the first label
    const [ordinalDayType, setOrdinalDayType] = useState('day')
    const [cronExpression, setCronExpression] = useState('* * * * *')


    const [destinationAddress, setDestinationAddress] = useState('')
    const [contractABI, setContractABI] = useState('')
    const [actionData, setActionData] = useState({stores: []})

    useEffect(() => {
        // Load action data from local storage
        const storedActionData = localStorage.getItem('selectedActions')
        if (storedActionData) {
            try {
                const parsedData = JSON.parse(storedActionData)
                setActionData(parsedData)
            } catch (error) {
                console.error('Error parsing stored action data:', error)
                setActionData([])
            }
        } else {
            setActionData([])
        }
    }, [])


    useEffect(() => {
        updateCronExpression()
    }, [timeFrequency, timePeriod, selectedDays, selectedMonths, monthDay, ordinalDay, ordinalDayType])

    const updateCronExpression = () => {
        let expression = '* * * * *'
        switch (timeFrequency) {
            case 'daily':
                expression = `0 0 */${timePeriod} * *`
                break
            case 'weekly':
                const days = selectedDays.map(day => weekDays.indexOf(day) + 1).join(',')
                expression = `0 0 * * ${days}`
                break
            case 'monthly':
                if (ordinalDay) {
                    const dayNum = ordinalDay === 'last' ? 'L' : (ordinals.indexOf(ordinalDay) + 1)
                    const dayType = ordinalDayType === 'day' ? '' : ordinalDayType.slice(0, 3).toUpperCase()
                    expression = `0 0 ${dayNum}${dayType} */${timePeriod} *`
                } else {
                    expression = `0 0 ${monthDay} */${timePeriod} *`
                }
                break
            case 'yearly':
                const monthNums = selectedMonths.map(month => months.indexOf(month) + 1).join(',')
                if (ordinalDay) {
                    const dayNum = ordinalDay === 'last' ? 'L' : (ordinals.indexOf(ordinalDay) + 1)
                    const dayType = ordinalDayType === 'day' ? '' : ordinalDayType.slice(0, 3).toUpperCase()
                    expression = `0 0 ${dayNum}${dayType} ${monthNums} *`
                } else {
                    expression = `0 0 ${monthDay} ${monthNums} *`
                }
                break
        }
        setCronExpression(expression)
    }

    const handleTriggerSelect = (triggerId) => {
        setSelectedTrigger(triggerId)
        if (triggerId !== 'time') {
            setTimeOption(null)
            setTimeValue('')
        }
    }


    const handleActionSelect = (action) => {
        setSelectedActions(prevActions => {
            const actionIndex = prevActions.findIndex(a => a.action.action_name === action.action.action_name);
            if (actionIndex > -1) {
                // Action is already selected, remove it
                return prevActions.filter(a => a.action.action_name !== action.action.action_name);
            } else {
                // Action is not selected, add it
                return [...prevActions, {...action, quantity: 1}];
            }
        });
    }


    const handleSelectAllForStore = (storeName, select) => {
        setSelectedActions(prevActions => {
            // @ts-ignore
            const storeActions = actionData.stores
                .find(store => store.storeInfo.storeName === storeName)
                .actions;

            if (select) {
                // Add all actions from this store that aren't already selected
                const actionsToAdd = storeActions.filter(
                    action => !prevActions.some(a => a.actionName === action.actionName)
                ).map(action => ({...action, quantity: 1}));
                return [...prevActions, ...actionsToAdd];
            } else {
                // Remove all actions from this store
                return prevActions.filter(
                    action => !storeActions.some(a => a.actionName === action.actionName)
                );
            }
        });
    }

    const handleActionQuantityChange = (index, quantity) => {
        const newActions = [...selectedActions]
        newActions[index].quantity = quantity
        setSelectedActions(newActions)
    }


    const handleSubmit = () => {

        const newWorkflow = {
            workflow_name: title,
            trigger_type: selectedTrigger,
            trigger_value: selectedTrigger === 'time' ? cronExpression :
                selectedTrigger === 'onchain' ? `${onchainAddress}::${onchainEvent}::${contractABI}` :
                    selectedTrigger === 'webhook' ? webhookParams : '',
            actions: selectedActions.reduce((acc, action) => {
                acc[action.action_params.customName] = {
                    quantity: action.quantity || 1,
                    icon: action.action.action_icon
                }
                return acc
            }, {}),
            destination_address: destinationAddress
        }

        // Get existing workflows from local storage
        const existingWorkflows = JSON.parse(localStorage.getItem('project_workflows') || '[]')

        // Add new workflow
        existingWorkflows.push(newWorkflow)

        // Save updated workflows to local storage
        localStorage.setItem('project_workflows', JSON.stringify(existingWorkflows))

        // Redirect to workflows page or show success message
        console.log('Workflow saved:', newWorkflow)

        // Redirect to workflows page
        window.location.href = '/workflows'
    }


    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle"/>
            <div className="drawer-content flex flex-col p-8">
                <h1 className="text-3xl font-bold mb-8">Create Workflow</h1>

                <div className="form-control w-full max-w-lg mb-6">
                    <label className="label">
                        <span className="label-text">Workflow Title</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter workflow title"
                        className="input input-bordered w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>


                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Set Up Your Trigger</h2>
                    <div className="space-y-4">
                        {triggerOptions.map((trigger) => (
                            <div
                                key={trigger.id}
                                className={`card ${selectedTrigger === trigger.id ? 'bg-primary text-primary-content' : 'bg-base-100'} shadow-xl cursor-pointer`}
                                onClick={() => handleTriggerSelect(trigger.id)}
                            >
                                <div className="card-body">
                                    <h3 className="card-title">{trigger.id === 'onchain' ? 'On Chain Event' : trigger.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedTrigger === 'time' && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Time Trigger Settings</h3>
                        <select
                            className="select select-bordered w-full max-w-xs mb-2"
                            value={timeFrequency}
                            onChange={(e) => setTimeFrequency(e.target.value)}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>

                        {timeFrequency === 'daily' && (
                            <div className="flex items-center">
                                <span>Every</span>
                                <input
                                    type="number"
                                    className="input input-bordered w-20 mx-2"
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(parseInt(e.target.value))}
                                    min="1"
                                />
                                <span>day(s)</span>
                            </div>
                        )}

                        {timeFrequency === 'weekly' && (
                            <div>
                                <div className="flex items-center mb-2">
                                    <span>Every</span>
                                    <input
                                        type="number"
                                        className="input input-bordered w-20 mx-2"
                                        value={timePeriod}
                                        onChange={(e) => setTimePeriod(parseInt(e.target.value))}
                                        min="1"
                                        disabled
                                    />
                                    <span>week(s) on:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {weekDays.map(day => (
                                        <label key={day} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="checkbox mr-2"
                                                checked={selectedDays.includes(day)}
                                                onChange={() => {
                                                    if (selectedDays.includes(day)) {
                                                        setSelectedDays(selectedDays.filter(d => d !== day))
                                                    } else {
                                                        setSelectedDays([...selectedDays, day])
                                                    }
                                                }}
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {timeFrequency === 'monthly' && (
                            <div>
                                <div className="flex items-center mb-2">
                                    <span>Every</span>
                                    <input
                                        type="number"
                                        className="input input-bordered w-20 mx-2"
                                        value={timePeriod}
                                        onChange={(e) => setTimePeriod(parseInt(e.target.value))}
                                        min="1"
                                    />
                                    <span>month(s)</span>
                                </div>
                                <div className="flex items-center">
                                    <label className="mr-4">
                                        <input
                                            type="radio"
                                            className="radio mr-2"
                                            checked={ordinalDay === ''} // Ensure "On day" is selected by default
                                            onChange={() => setOrdinalDay('')}
                                        />
                                        On day
                                        <input
                                            type="number"
                                            className="input input-bordered w-20 ml-2"
                                            value={monthDay}
                                            onChange={(e) => setMonthDay(parseInt(e.target.value))}
                                            min="1"
                                            max="31"
                                        />
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            className="radio mr-2"
                                            checked={ordinalDay !== ''}
                                            onChange={() => setOrdinalDay(ordinals[0])}
                                            disabled // Disable the "On the" option
                                        />
                                        On the
                                        <select
                                            className="select select-bordered mx-2"
                                            value={ordinalDay}
                                            onChange={(e) => setOrdinalDay(e.target.value)}
                                            disabled // Disable the select dropdown
                                        >
                                            {ordinals.map(ord => (
                                                <option key={ord} value={ord}>{ord}</option>
                                            ))}
                                            <option value="last">last</option>
                                        </select>
                                        <select
                                            className="select select-bordered"
                                            value={ordinalDayType}
                                            onChange={(e) => setOrdinalDayType(e.target.value)}
                                            disabled // Disable the select dropdown
                                        >
                                            <option value="day">day</option>
                                            <option value="weekday">weekday</option>
                                            <option value="weekend">weekend day</option>
                                            {weekDays.map(day => (
                                                <option key={day} value={day.toLowerCase()}>{day}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        )}

                        {timeFrequency === 'yearly' && (
                            <div>
                                <div className="flex items-center mb-2">
                                    <span>Every</span>
                                    <input
                                        type="number"
                                        className="input input-bordered w-20 mx-2"
                                        value={timePeriod}
                                        onChange={(e) => setTimePeriod(parseInt(e.target.value))}
                                        min="1"
                                    />
                                    <span>year(s) in:</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {months.map(month => (
                                        <label key={month} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="checkbox mr-2"
                                                checked={selectedMonths.includes(month)}
                                                onChange={() => {
                                                    if (selectedMonths.includes(month)) {
                                                        setSelectedMonths(selectedMonths.filter(m => m !== month))
                                                    } else {
                                                        setSelectedMonths([...selectedMonths, month])
                                                    }
                                                }}
                                            />
                                            {month}
                                        </label>
                                    ))}
                                </div>
                                <div className="flex items-center">
                                    <label className="mr-4">
                                        <input
                                            type="radio"
                                            className="radio mr-2"
                                            checked={!ordinalDay}
                                            onChange={() => setOrdinalDay('')}
                                        />
                                        On day
                                        <input
                                            type="number"
                                            className="input input-bordered w-20 ml-2"
                                            value={monthDay}
                                            onChange={(e) => setMonthDay(parseInt(e.target.value))}
                                            min="1"
                                            max="31"
                                        />
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            className="radio mr-2"
                                            checked={!!ordinalDay}
                                            onChange={() => setOrdinalDay(ordinals[0])}
                                            disabled // Disable the "On the" option
                                        />
                                        On the
                                        <select
                                            className="select select-bordered mx-2"
                                            value={ordinalDay}
                                            onChange={(e) => setOrdinalDay(e.target.value)}
                                            disabled // Disable the select dropdown
                                        >
                                            {ordinals.map(ord => (
                                                <option key={ord} value={ord}>{ord}</option>
                                            ))}
                                            <option value="last">last</option>
                                        </select>
                                        <select
                                            className="select select-bordered"
                                            value={ordinalDayType}
                                            onChange={(e) => setOrdinalDayType(e.target.value)}
                                            disabled // Disable the select dropdown
                                        >
                                            <option value="day">day</option>
                                            <option value="weekday">weekday</option>
                                            <option value="weekend">weekend day</option>
                                            {weekDays.map(day => (
                                                <option key={day} value={day.toLowerCase()}>{day}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <p>{cronToNaturalLanguage(cronExpression)}</p>
                        </div>
                    </div>
                )}


                {selectedTrigger === 'onchain' && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">On-chain Event Settings</h3>
                        <div className="flex flex-col space-y-2 w-full max-w-xs">
                            <input
                                type="text"
                                placeholder="Contract Address"
                                className="input input-bordered w-full"
                                value={onchainAddress}
                                onChange={(e) => setOnchainAddress(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Event (e.g., MintEvent)"
                                className="input input-bordered w-full"
                                value={onchainEvent}
                                onChange={(e) => setOnchainEvent(e.target.value)}
                            />
                            <textarea
                                className="textarea textarea-bordered w-full h-24 resize-none"
                                placeholder="Enter smart contract ABI"
                                value={contractABI}
                                onChange={(e) => setContractABI(e.target.value)}
                            ></textarea>
                        </div>

                    </div>
                )}

                {selectedTrigger === 'webhook' && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Webhook Settings</h3>
                        <textarea
                            className="textarea textarea-bordered w-full max-w-xs"
                            placeholder="Enter webhook parameters"
                            value={webhookParams}
                            onChange={(e) => setWebhookParams(e.target.value)}
                        ></textarea>
                    </div>
                )}


                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Choose Your Triggered Actions</h2>
                    <button className="btn btn-primary" onClick={() => setIsActionModalOpen(true)}>
                        Choose Your Actions
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Destination Address</h3>
                    <input
                        type="text"
                        placeholder="Enter destination address"
                        className="input input-bordered w-full max-w-xs"
                        value={destinationAddress}
                        onChange={(e) => setDestinationAddress(e.target.value)}
                    />
                </div>


                {selectedActions.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Selected Actions</h3>
                        {selectedActions.map((action, index) => (
                            <div key={index} className="card bg-base-100 shadow-xl mb-4">
                                <div className="card-body">
                                    <div className="flex items-center mb-2">
                                        <Image
                                            src={action.action.action_icon}
                                            alt={action.action.action_name}
                                            width={40}
                                            height={40}
                                            className="mr-2"
                                        />
                                        <h4 className="card-title">{action.action_params.customName}</h4>
                                    </div>
                                    <p>{action.action.action_description}</p>
                                    <div className="flex items-center mt-2">
                                        <span className="mr-2">Quantity:</span>
                                        <input
                                            type="number"
                                            className="input input-bordered w-20"
                                            value={action.quantity || 1}
                                            onChange={(e) => handleActionQuantityChange(index, parseInt(e.target.value))}
                                            min="1"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                <div className="flex justify-end mt-8">
                    <Link href="/workflows">
                        <button className="btn btn-neutral mr-2">Cancel</button>
                    </Link>
                    <button className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
                </div>
            </div>

            <Sidebar/>


            <dialog id="action_modal" className={`modal ${isActionModalOpen ? 'modal-open' : ''}`}>
                <form method="dialog" className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg mb-4">Select Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.isArray(actionData) ? (
                            actionData.map((action, index) => (
                                <div key={index} className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <div className="flex items-center mb-2">
                                            <Image
                                                src={action.action.action_icon}
                                                alt={action.action.action_name}
                                                width={40}
                                                height={40}
                                                className="mr-2"
                                            />
                                            <h3 className="card-title">{action.action_params.customName}</h3>
                                        </div>
                                        <p>{action.action.action_description}</p>
                                        <div className="form-control">
                                            <label className="label cursor-pointer">
                                                <span className="label-text">Select</span>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    onChange={() => handleActionSelect(action)}
                                                    checked={selectedActions.some(a => a.action_params.customName === action.action_params.customName)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No actions available</p>
                        )}
                    </div>
                    <div className="modal-action">
                        <button className="btn" onClick={() => setIsActionModalOpen(false)}>Close</button>
                    </div>
                </form>
            </dialog>


        </div>
    )
}

function cronToNaturalLanguage(cronExpression) {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpression.split(' ');

    if (minute === '0' && hour === '0' && dayOfMonth === '*/1' && month === '*' && dayOfWeek === '*') {
        return "Daily at 00:00";
    }

    if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return "Daily at 00:00";
    }

    let description = [];

    // Time
    if (minute === '0' && hour !== '*') {
        description.push(`at ${hour.padStart(2, '0')}:00`);
    } else if (minute !== '*' && hour !== '*') {
        description.push(`at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`);
    }

    // Frequency
    if (dayOfMonth === '*/1' && month === '*' && dayOfWeek === '*') {
        description.unshift('Daily');
    } else if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekdays = dayOfWeek.split(',').map(d => days[parseInt(d)]).join(', ');
        description.unshift(`Weekly on ${weekdays}`);
    } else if (dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
        if (dayOfMonth.includes('/')) {
            const [, interval] = dayOfMonth.split('/');
            description.unshift(`Every ${interval} days`);
        } else {
            description.unshift(`Monthly on day ${dayOfMonth}`);
        }
    } else if (dayOfMonth === '*' && month !== '*' && dayOfWeek === '*') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthNames = month.split(',').map(m => months[parseInt(m) - 1]).join(', ');
        description.unshift(`Annually in ${monthNames}`);
    }

    return description.join(' ') || 'Custom schedule';
}