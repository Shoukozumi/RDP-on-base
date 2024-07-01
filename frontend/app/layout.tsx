import './globals.css'
import type { Metadata } from 'next'
import React from "react";

export const metadata: Metadata = {
  title: 'Refract Developer Platform',
  description: 'Login to RDP',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body>{children}</body>
      </html>
  )
}