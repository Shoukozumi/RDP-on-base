"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const url = `http://localhost:3000`;

export default function Home() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            router.push('/dashboard')
        }
    }, [router])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const endpoint = isSignUp ? '/auth/signup' : '/auth/login'

        try {
            const response = await fetch(`${url}${endpoint}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(isSignUp
                    ? {username, password, email , first_name, last_name}
                    : {email, password}),
            })

            const data = await response.json()

            if (response.ok) {
                if (!isSignUp) {
                    localStorage.setItem('token', data.token)
                    router.push('/dashboard')
                } else {
                    setIsSignUp(false) // Switch to login form after successful signup
                    setError('Signup successful. Please log in.')
                }
            } else {
                setError("Error: " + data.message || 'An error occurred')
            }
        } catch (error) {
            console.error('Error:', error)
            setError('An unexpected error occurred')
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-600 flex flex-col lg:flex-row items-center justify-between p-8 lg:p-16">
            {/* Left side content */}
            <div className="text-white mb-12 lg:mb-0 lg:w-1/2">
                <h2 className="text-2xl mb-4">Refract Labs</h2>
                <h1 className="text-6xl lg:text-8xl font-bold mb-6">
                    Refract<br/>
                    Developer<br/>
                    Platform
                </h1>
                <Link href="/contact" className="text-3xl text-purple-300 hover:text-purple-100 transition-colors">
                    View Docs →
                </Link>
            </div>

            {/* Right side form */}
            <div className="bg-white rounded-3xl p-8 w-full max-w-md">
                <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold">Refract Developer Platform</h2>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            required
                        />
                    </div>

                    {isSignUp && (
                        <>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        {isSignUp ? 'Sign up' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="font-medium text-purple-600 hover:text-purple-500"
                    >
                        {isSignUp ? 'Sign in' : 'Sign up now'}
                    </button>
                </p>
            </div>

            <Link href="/contact"
                  className="absolute top-8 right-8 text-white text-xl hover:text-purple-300 transition-colors">
                Contact Us
            </Link>
        </main>
    )
}
