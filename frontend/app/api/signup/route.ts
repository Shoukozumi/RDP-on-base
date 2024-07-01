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
    const { email, password } = body

    // Here you would typically create a new user in your database
    // For this example, we'll just check if the email is not empty
    if (email && password) {
        const token = sign({ email }, SECRET_KEY, { expiresIn: '1h' })
        return NextResponse.json({ token, message: 'User created successfully' })
    } else {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 })
    }
}