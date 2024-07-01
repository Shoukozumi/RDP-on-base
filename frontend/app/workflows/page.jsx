'use client'

import {useState, useEffect} from 'react'
import Sidebar from "@/app/sidebar"
import Link from "next/link";
import Image from 'next/image';

export default function Workflows() {
    const [workflows, setWorkflows] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [selectedWorkflow, setSelectedWorkflow] = useState(null)

    const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);

    useEffect(() => {
        const fetchWorkflows = () => {
            setIsLoading(true)
            try {
                const storedWorkflows = localStorage.getItem('project_workflows')
                if (storedWorkflows) {
                    setWorkflows(JSON.parse(storedWorkflows))
                }
            } catch (error) {
                console.error("Error fetching workflows:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchWorkflows()
    }, [])

    const filteredWorkflows = workflows.filter(workflow =>
        workflow.workflow_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleManualTrigger = (workflow) => {
        console.log(`Manually triggered workflow ${workflow.workflow_name}`)
        setIsTriggerModalOpen(true);
        // Add your manual trigger logic here
    }

    const handleToggleWorkflow = (workflow) => {
        // This is a placeholder. You'll need to implement the actual toggle logic
        console.log(`Toggled workflow ${workflow.workflow_name}`)
    }

    const handleViewDetails = (workflow) => {
        setSelectedWorkflow(workflow)
    }

    const closeModal = () => {
        setSelectedWorkflow(null)
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle"/>
            <div className="drawer-content flex flex-col">
                <div className="navbar bg-base-100">
                    <div className="flex-1">
                        <a className="btn btn-ghost normal-case text-xl">Workflows</a>
                    </div>
                    <div className="flex-none gap-2">
                        <div className="form-control">
                            <input
                                type="text"
                                placeholder="Search workflows"
                                className="input input-bordered w-24 md:w-auto"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <main className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body flex flex-col justify-center items-center">
                                    <h2 className="card-title text-2xl mb-4">Add a Workflow</h2>
                                    <Link href="/create-workflow">
                                        <button className="btn btn-primary btn-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M12 4.5v15m7.5-7.5h-15"/>
                                            </svg>
                                            Create Workflow
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {filteredWorkflows.map((workflow, index) => (
                                <div key={index} className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title">{workflow.workflow_name}</h2>
                                        <div className="grid grid-cols-2 gap-6 my-6">
                                            <div className="rounded-lg p-4">
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <div className="mb-3">
                                                        <div
                                                            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getTriggerTypeColor(workflow.trigger_type)}`}
                                                        >
                                                            {formatTriggerType(workflow.trigger_type)}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-base-content text-opacity-60">Trigger
                                                        Type
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rounded-lg p-4">
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <div className="text-3xl font-bold mb-2">
                                                        {Object.keys(workflow.actions).length}
                                                    </div>
                                                    <div className="text-sm text-base-content text-opacity-60">Actions
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p>Destination: {workflow.destination_address}</p>
                                        <div className="card-actions justify-end mt-4">
                                            <button className="btn btn-primary"
                                                    onClick={() => handleManualTrigger(workflow)}>Manual Trigger
                                            </button>

                                            <TriggerModal
                                                isOpen={isTriggerModalOpen}
                                                onClose={() => setIsTriggerModalOpen(false)}
                                            />
                                            <button className="btn btn-success"
                                                    onClick={() => handleToggleWorkflow(workflow)}>Toggle
                                            </button>
                                            <button className="btn btn-ghost"
                                                    onClick={() => handleViewDetails(workflow)}>View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {selectedWorkflow && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-3xl">
                            <h3 className="font-bold text-xl mb-4">{selectedWorkflow.workflow_name} Details</h3>


                            <div className="mb-6">
                                <h4 className="font-semibold text-lg mb-2">Trigger Type</h4>
                                <div
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTriggerTypeColor(selectedWorkflow.trigger_type)}`}>
                                    {formatTriggerType(selectedWorkflow.trigger_type)}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold text-lg">Trigger Details</h4>
                                {selectedWorkflow.trigger_type === 'time' && (
                                    <p className="text-base">Frequency: {cronToNaturalLanguage(selectedWorkflow.trigger_value)}</p>
                                )}
                                {selectedWorkflow.trigger_type === 'onchain' && (
                                    <div>
                                        {selectedWorkflow.trigger_value.split('::').map((value, index) => (
                                            <div key={index} className="mb-2">
                                                <p className="font-medium">
                                                    {index === 0 && 'Contract Address: '}
                                                    {index === 1 && 'Event: '}
                                                    {index === 2 && 'Contract ABI: '}
                                                </p>
                                                {index !== 2 ? (
                                                    <p className="text-base">{value}</p>
                                                ) : (
                                                    <div className="mockup-code mt-2">
                        <pre><code>
                            {(() => {
                                try {
                                    return JSON.stringify(JSON.parse(value), null, 2);
                                } catch (error) {
                                    // If parsing fails, return the original string
                                    return value;
                                }
                            })()}
                        </code></pre>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedWorkflow.trigger_type === 'manual' && (
                                    <p className="text-base">Manual trigger</p>
                                )}

                                {selectedWorkflow.trigger_type === 'webhook' && (
                                    <div>
                                        <p className="text-base mb-2">Webhook Payload:</p>
                                        <div className="mockup-code">
            <pre><code>
                {(() => {
                    try {
                        return JSON.stringify(JSON.parse(selectedWorkflow.trigger_value), null, 2);
                    } catch (error) {
                        // If parsing fails, return the original string
                        return selectedWorkflow.trigger_value;
                    }
                })()}
            </code></pre>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold text-lg">Destination Address</h4>
                                <p className="text-base">{selectedWorkflow.destination_address}</p>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold text-lg">Actions</h4>
                                <div className="grid grid-cols-1 gap-4 mt-2">
                                    {Object.entries(selectedWorkflow.actions).map(([actionName, actionData]) => (
                                        <div key={actionName}
                                             className="flex items-center space-x-4 bg-base-200 p-3 rounded-lg">
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={actionData.icon}
                                                    alt={actionName}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{actionName}</p>
                                                <p className="text-sm text-base-content text-opacity-70">Quantity: {actionData.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-action">
                                <button className="btn" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                )}


            </div>

            <Sidebar/>
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


const formatTriggerType = (type) => {
    const words = type.split('-');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const getTriggerTypeColor = (type) => {
    switch (type) {
        case 'time':
            return 'bg-blue-100 text-blue-800';
        case 'onchain':
            return 'bg-green-100 text-green-800';
        case 'manual':
            return 'bg-yellow-100 text-yellow-800';
        case 'webhook':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};




const TriggerModal = ({ isOpen, onClose }) => {
    const [stage, setStage] = useState(0);
    const [showSuccessTick, setShowSuccessTick] = useState(false);
    const stages = [
        "Command sent to Refractor",
        "Waiting for block confirmation",
        "Success"
    ];

    useEffect(() => {
        if (isOpen) {
            setStage(0);
            setShowSuccessTick(false);
            const timer1 = setTimeout(() => setStage(1), 2000);
            const timer2 = setTimeout(() => setStage(2), 10000);
            const timer3 = setTimeout(() => setShowSuccessTick(true), 11000);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box relative">
                <h3 className="font-bold text-lg mb-4">Sending Actions</h3>
                <div className="mb-4">
                    {stages.map((s, index) => (
                        <div key={index} className={`flex items-center mb-2 ${index > stage ? 'opacity-50' : ''}`}>
                            {index < stage || (index === 2 && showSuccessTick) ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : index === stage ? (
                                <span className="loading loading-spinner loading-sm mr-2"></span>
                            ) : (
                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-2"></div>
                            )}
                            <span>{s}</span>
                        </div>
                    ))}
                </div>
                {showSuccessTick && (
                    <div className="modal-action">
                        <button className="btn btn-primary" onClick={onClose}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};
