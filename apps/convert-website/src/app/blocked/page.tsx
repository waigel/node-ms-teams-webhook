"use client";
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';

function Blocked() {
    const route = useRouter()
    return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-semibold">Blocked (Rate limited)</h1>
            <p>Sorry, you have been rate limited. Please try again later.</p>
            <Button onClick={() => route.push('/')}>
                Refresh
            </Button>
        </div>
    )
}

export default Blocked