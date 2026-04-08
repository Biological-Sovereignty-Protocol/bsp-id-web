/**
 * BSP API Client
 * All requests go through the central bsp-registry-api.
 * No local relay — the frontend calls the API directly.
 */

const REGISTRY_URL = process.env.NEXT_PUBLIC_BSP_REGISTRY_URL || 'https://api.biologicalsovereigntyprotocol.com'

export async function apiPost<T = any>(path: string, body: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${REGISTRY_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`)
    return data as T
}

export async function apiGet<T = any>(path: string): Promise<T> {
    const res = await fetch(`${REGISTRY_URL}${path}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`)
    return data as T
}

export async function apiDelete<T = any>(path: string, body?: Record<string, unknown>): Promise<T> {
    const options: RequestInit = { method: 'DELETE' }
    if (body) {
        options.headers = { 'Content-Type': 'application/json' }
        options.body = JSON.stringify(body)
    }
    const res = await fetch(`${REGISTRY_URL}${path}`, options)
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`)
    return data as T
}
