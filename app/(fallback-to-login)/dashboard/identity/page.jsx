'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Identity() {
	const router = useRouter()
	useEffect(() => { router.push('/') })
	return <div></div>
}