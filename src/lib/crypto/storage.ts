/**
 * Browser Storage Layer
 * Manages the Ed25519 Private Key and Seed Phrase securely in the browser.
 * NEVER uses localStorage. Uses IndexedDB, which is tied to the origin.
 */

const DB_NAME = 'BSPIdentityStore'
const STORE_NAME = 'KeyVault'

function getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' })
            }
        }
    })
}

export async function storeIdentity(domain: string, privateKeyHex: string, publicKeyHex: string): Promise<void> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)

        const request = store.put({
            id: 'current_identity',
            domain,
            privateKeyHex,
            publicKeyHex,
            savedAt: new Date().toISOString()
        })

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}

export async function getIdentity(): Promise<{ domain: string, privateKeyHex: string, publicKeyHex: string } | null> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)

        const request = store.get('current_identity')

        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)
    })
}

export async function clearIdentity(): Promise<void> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)

        const request = store.delete('current_identity')

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}
