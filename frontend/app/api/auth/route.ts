import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not set in the environment variables')
}

export async function POST(request: Request) {
    const body = await request.json()
    const { email, password, isSignUp } = body

    if (email && password) {
        // Here you would typically verify the email and password against your database for sign-in
        // or create a new user for sign-up

        if (isSignUp) {
            // Implement user creation logic here
            // For now, we'll just return a success message
            const token = sign({ email }, SECRET_KEY, { expiresIn: '1h' })
            return NextResponse.json({ token, message: 'User created successfully' })
        } else {
            // Implement sign-in verification logic here
            // For now, we'll just return a token
            const token = sign({ email }, SECRET_KEY, { expiresIn: '1h' })
            return NextResponse.json({ token })
        }
    } else {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 })
    }
}
