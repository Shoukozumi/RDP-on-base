'use client'

import {useState, useEffect, useRef} from 'react'
import {usePathname} from 'next/navigation'
import Sidebar from "@/app/sidebar";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import {FaCopy, FaDownload} from 'react-icons/fa';
import {router} from "next/client";

export default function Dashboard() {

    const router = useRouter()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [nodeStatus, setNodeStatus] = useState(null)
    const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false)
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
    const [selectedWallet, setSelectedWallet] = useState('usdc')
    const [withdrawAddress, setWithdrawAddress] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [connectedStores, setConnectedStores] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [projectActions, setProjectActions] = useState([])
    const [selectedAction, setSelectedAction] = useState(null)

    const url = "http://localhost:3000"

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                console.error('No token found')
                router.push('/')
                return
            }

            const projectId = Cookies.get('currentProjectId')

            try {
                const [nodeStatusResponse, connectedStoresResponse] = await Promise.all([fetch(`${url}/refractor/node_status`, {
                    headers: {
                        'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
                    },
                }), fetch(`${url}/projects/${projectId}/apps`, {
                    headers: {
                        'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
                    },
                })])

                if (nodeStatusResponse.ok) {
                    const data = await nodeStatusResponse.json()
                    setNodeStatus(data)
                }

                if (connectedStoresResponse.ok) {
                    const data = await connectedStoresResponse.json()
                    setConnectedStores(data)
                } else {
                    console.error("Failed to fetch connected stores")
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()

        try {
            const storedActions = localStorage.getItem("selectedActions")
            if (storedActions) {
                const parsedActions = JSON.parse(storedActions)
                setProjectActions(parsedActions)
            }
        } catch (error) {
            console.error('Error parsing selectedActions:', error)
            setProjectActions([])
        }
    }, [router])

    const handleUpdateAction = (updatedAction) => {
        const updatedActions = projectActions.map(action => action.customName === updatedAction.customName ? updatedAction : action)
        setProjectActions(updatedActions)
        localStorage.setItem("selectedActions", JSON.stringify(updatedActions))
    }

    const filteredStores = connectedStores.filter(store => store.app_name.toLowerCase().includes(searchTerm.toLowerCase()) || store.app_type.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleDeleteStore = (id) => {
        setConnectedStores(stores => stores.filter(store => store.app_id !== id))
    }

    const handleCopyAddress = () => {
        const address = selectedWallet === 'usdc' ? nodeStatus.crypto_balance.usdc.wallet_address : nodeStatus.crypto_balance.base.wallet_address
        navigator.clipboard.writeText(address || '')
        alert('Address copied to clipboard!')
    }

    const handleWithdraw = () => {
        const currentBalance = selectedWallet === 'usdc' ? nodeStatus.crypto_balance.usdc.balance : nodeStatus.crypto_balance.base.balance
        const amount = parseFloat(withdrawAmount)
        if (currentBalance && amount <= currentBalance) {
            console.log(`Withdrawing ${amount} ${selectedWallet.toUpperCase()} to: ${withdrawAddress}`)
            setIsWithdrawModalOpen(false)
            setWithdrawAddress('')
            setWithdrawAmount('')
        } else {
            alert('Invalid withdrawal amount')
        }
    }

    if (!nodeStatus) {
        return (<div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>)
    }

    return (<div className="drawer lg:drawer-open">
            <input
                id="my-drawer-2"
                type="checkbox"
                className="drawer-toggle"
                checked={isDrawerOpen}
                onChange={(e) => setIsDrawerOpen(e.target.checked)}
            />
            <div className="drawer-content flex flex-col items-center mt-16 ml-12 mr-12">
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>

                <main className="p-4 w-full">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, Dev</h1>

                    <CodeSnippetPresenter/>

                    {/* Connected Stores Section */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold mb-4">Connected Stores</h2>
                            <div className="form-control w-full max-w-xs mb-4">
                                <input
                                    type="text"
                                    placeholder="Search stores"
                                    className="input input-bordered w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                <tr>
                                    <th>App Name</th>
                                    <th>App Type</th>
                                    <th>Credentials</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredStores.map(store => (<tr key={store.app_id}>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div>
                                                    <div className="font-bold">{store.app_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{store.app_type}</td>
                                        <CredentialsCell credentials={store.app_credentials}/>
                                        <td>
                                            <div onClick={() => handleDeleteStore(store.app_id)}>
                                                <svg
                                                    width="18"
                                                    height="20"
                                                    viewBox="0 0 18 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{cursor: 'pointer'}}
                                                >
                                                    <path
                                                        d="M1.5 5.00002H3.16667M3.16667 5.00002H16.5M3.16667 5.00002V16.6667C3.16667 17.1087 3.34226 17.5326 3.65482 17.8452C3.96738 18.1578 4.39131 18.3334 4.83333 18.3334H13.1667C13.6087 18.3334 14.0326 18.1578 14.3452 17.8452C14.6577 17.5326 14.8333 17.1087 14.8333 16.6667V5.00002H3.16667ZM5.66667 5.00002V3.33335C5.66667 2.89133 5.84226 2.4674 6.15482 2.15484C6.46738 1.84228 6.89131 1.66669 7.33333 1.66669H10.6667C11.1087 1.66669 11.5326 1.84228 11.8452 2.15484C12.1577 2.4674 12.3333 2.89133 12.3333 3.33335V5.00002M7.33333 9.16669V14.1667M10.6667 9.16669V14.1667"
                                                        stroke="#475467"
                                                        strokeWidth="1.66667"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Project Actions Section */}

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Project Actions</h2>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                <tr>
                                    <th>Icon</th>
                                    <th>Custom Name</th>
                                    <th>Action Name</th>
                                    <th>Description</th>
                                    <th>Details</th>
                                </tr>
                                </thead>
                                <tbody>
                                {projectActions.map((actionItem, index) => (<tr key={index}>
                                        <td>
                                            <Image
                                                src={actionItem.action.action_icon}
                                                alt={actionItem.action.action_name}
                                                width={80}
                                                height={80}
                                            />
                                        </td>
                                        <td>{actionItem.customName}</td>
                                        <td>{actionItem.action.action_name}</td>
                                        <td>{actionItem.action.action_description}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => setSelectedAction(actionItem)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {selectedAction && (<ActionDetails
                            action={selectedAction}
                            onClose={() => setSelectedAction(null)}
                            onUpdate={handleUpdateAction}
                        />)}
                </main>
            </div>

            {/* Sidebar content */}
            <Sidebar/>


            {/* Add Funds Modal */}
            <dialog id="add_funds_modal" className={`modal ${isAddFundsModalOpen ? 'modal-open' : ''}`}>
                <form method="dialog" className="modal-box">
                    <h3 className="font-bold text-lg">Add Funds</h3>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Select Wallet</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                        >
                            <option value="usdc">USDC</option>
                            <option value="base">BASE</option>
                        </select>
                    </div>
                    <p className="py-4">Send funds to this address:</p>
                    <p className="bg-base-200 p-2 rounded">
                        {selectedWallet === 'usdc' ? nodeStatus.crypto_balance.usdc.wallet_address : nodeStatus.crypto_balance.base.wallet_address}
                    </p>
                    <div className="modal-action">
                        <button className="btn btn-primary" onClick={handleCopyAddress}>Copy Address</button>
                        <button className="btn" onClick={() => setIsAddFundsModalOpen(false)}>Close</button>
                    </div>
                </form>
            </dialog>

            {/* Withdraw Modal */}
            <dialog id="withdraw_modal" className={`modal ${isWithdrawModalOpen ? 'modal-open' : ''}`}>
                <form method="dialog" className="modal-box">
                    <h3 className="font-bold text-lg">Withdraw Funds</h3>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Select Wallet</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                        >
                            <option value="usdc">USDC</option>
                            <option value="base">BASE</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Withdrawal Address</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter address"
                            className="input input-bordered"
                            value={withdrawAddress}
                            onChange={(e) => setWithdrawAddress(e.target.value)}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Amount</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            className="input input-bordered"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                    </div>
                    <div className="mt-4">
                        <p>Current
                            Balance: {selectedWallet === 'usdc' ? nodeStatus.crypto_balance.usdc.balance.toFixed(2) : nodeStatus.crypto_balance.base.balance.toFixed(2)} {selectedWallet.toUpperCase()}</p>
                        <p>Remaining After
                            Withdrawal: {selectedWallet === 'usdc' ? (nodeStatus.crypto_balance.usdc.balance - parseFloat(withdrawAmount || '0')).toFixed(2) : (nodeStatus.crypto_balance.base.balance - parseFloat(withdrawAmount || '0')).toFixed(2)} {selectedWallet.toUpperCase()}</p>
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-primary" onClick={handleWithdraw}>Withdraw</button>
                        <button className="btn" onClick={() => setIsWithdrawModalOpen(false)}>Close</button>
                    </div>
                </form>
            </dialog>
        </div>)
}


const CredentialsCell = ({credentials}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const formatCredentials = (creds) => {
        if (typeof creds === 'string') {
            try {
                return JSON.parse(creds);
            } catch {
                return creds;
            }
        }
        return creds;
    };

    const formattedCredentials = formatCredentials(credentials);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (<td>
            <button
                onClick={toggleModal}
                className="btn btn-xs btn-outline"
            >
                Reveal
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">Credentials</h3>
                        {typeof formattedCredentials === 'object' ? (Object.entries(formattedCredentials).map(([key, value]) => (
                                <div key={key} className="mb-2">
                                    <span className="font-semibold">{key}: </span>
                                    <span>{JSON.stringify(value)}</span>
                                    <button
                                        onClick={() => copyToClipboard(JSON.stringify(value))}
                                        className="ml-2 btn btn-xs btn-outline"
                                    >
                                        Copy
                                    </button>
                                </div>))) : (<div>
                                <span>{formattedCredentials}</span>
                                <button
                                    onClick={() => copyToClipboard(formattedCredentials)}
                                    className="ml-2 btn btn-xs btn-outline"
                                >
                                    Copy
                                </button>
                            </div>)}
                        <button
                            onClick={toggleModal}
                            className="mt-4 btn btn-sm btn-primary"
                        >
                            Close
                        </button>
                    </div>
                </div>)}
        </td>);
};


const fieldNameMapping = {
    customName: 'Custom Name',
    'Select the gift card value': 'Gift Card Value',
    'Select your coupon type': 'Coupon Type',
    'Input your coupon percentage': 'Coupon Percentage',
    'Input your coupon cash value': 'Coupon Cash Value',
    'Include a message in the coupon': 'Coupon Message',
    'Input the Fleek function link': 'Fleek Function Link',
    shopify_store_id: 'Shopify Store ID',
    shopify_product_id: 'Shopify Product ID',
    shopify_product_name: 'Shopify Product Name',
    shopify_product_price: 'Shopify Product Price',
    tremendous_product_type: 'Tremendous Product Type',
    tremendous_product_id: 'Tremendous Product ID'
};

const getDisplayName = (key) => fieldNameMapping[key] || key;

const ActionDetails = ({action, onClose, onUpdate}) => {
    const [editedAction, setEditedAction] = useState(action);
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (section, key, value) => {
        setEditedAction(prev => ({
            ...prev, [section]: {
                ...prev[section], [key]: value
            }
        }));
    };

    const handleSave = () => {
        onUpdate(editedAction);
        setIsEditing(false);
    };

    const renderSection = (title, data, section) => (<div className="mt-4">
            <h4 className="font-semibold text-lg mb-2">{title}:</h4>
            {Object.entries(data).length > 0 ? (<div className="grid grid-cols-2 gap-4">
                    {Object.entries(data).map(([key, value]) => (<div key={key} className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">{getDisplayName(key)}</label>
                            {isEditing ? (<input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleInputChange(section, key, e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />) : (<p className="mt-1 text-sm text-gray-900">{value}</p>)}
                        </div>))}
                </div>) : (<p className="text-sm text-gray-500">No {title.toLowerCase()} available</p>)}
        </div>);

    return (<div className="modal modal-open">
            <div className="modal-box max-w-4xl">
                <h3 className="font-bold text-xl mb-4">{editedAction.action.action_name}</h3>
                <p className="text-sm text-gray-600 mb-6">{editedAction.action.action_description}</p>

                {renderSection('Action Parameters', editedAction.action_params, 'action_params')}
                {renderSection('Action Metadata', editedAction.action.action_metadata, 'action')}

                <div className="modal-action mt-6">
                    {isEditing ? (<>
                            <button className="btn btn-primary" onClick={handleSave}>Save</button>
                            <button className="btn" onClick={() => setIsEditing(false)}>Cancel</button>
                        </>) : (<button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>)}
                    <button className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>);
};


const CodeSnippetPresenter = () => {
    const [jwtToken, setJwtToken] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            router.push('/');
        } else {
            setJwtToken(token);
        }
    }, [router]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            // You might want to add some visual feedback here
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleDownload = () => {
        if (!jwtToken) {
            console.error('No token available');
            return;
        }

        fetch('http://localhost:3000/refractor/download-refractor', {
            method: 'GET', headers: {
                "ngrok-skip-browser-warning": "69420", 'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Get the filename from the Content-Disposition header
                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = '.env'; // default filename
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1];
                    }
                }

                return response.blob().then(blob => ({blob, filename}));
            })
            .then(({blob}) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = "refractor.tar";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Download failed:', error));
    };


    return (<div>
            <label htmlFor="deploy-modal" className="btn btn-primary w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"/>
                </svg>
                Deploy Your Bespoke Refractor Oracle Node
            </label>

            <input type="checkbox" id="deploy-modal" className="modal-toggle"/>
            <div className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg mb-4">Deploy Your Bespoke Refractor Oracle Node</h3>

                    <div className="mb-4">
                        <h4 className="font-semibold mb-2">Step 1: Install Docker</h4>
                        <a href="https://docs.docker.com/engine/install/" target="_blank" rel="noopener noreferrer"
                           className="link link-primary">
                            Docker Installation Guide
                        </a>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-semibold mb-2">Step 2: Download Refractor Client</h4>
                        <button className="btn btn-primary" onClick={handleDownload}>
                            <FaDownload className="mr-2"/> Download Image
                        </button>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-semibold mb-2">Step 3: Run Commands</h4>
                        <div className="mockup-code relative">
                            <pre data-prefix="1"><code>docker load -i /path/to/destination/refractor.tar</code></pre>
                            <pre
                                data-prefix="2"><code>docker run -it -e MNEMONICS="your wallet mnemonic here" refractor</code></pre>
                            <button
                                className="absolute top-2 right-2 btn btn-xs btn-ghost"
                                onClick={() => copyToClipboard(`docker load -i /path/to/destination/refractor.tar
docker run -it -e MNEMONICS="your wallet mnemonic here" refractor`)}
                            >
                                <FaCopy/>
                            </button>
                        </div>
                    </div>

                    <div className="modal-action">
                        <label htmlFor="deploy-modal" className="btn">Close</label>
                    </div>
                </div>
            </div>
        </div>);
};
