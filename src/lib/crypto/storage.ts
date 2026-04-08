/**
 * Browser Storage Layer
 * Manages the Ed25519 Private Key securely in the browser.
 * NEVER uses localStorage. Uses IndexedDB with AES-256-GCM encryption at rest.
 *
 * The private key is encrypted before writing to IndexedDB using a key derived
 * from the origin URL via SubtleCrypto. This prevents trivial XSS extraction —
 * an attacker would need to run crypto operations in the same origin context.
 */

const DB_NAME = 'BSPIdentityStore'
const STORE_NAME = 'KeyVault'
const ENCRYPTION_SALT = new TextEncoder().encode('BSP-IndexedDB-Encryption-v1')

async function deriveStorageKey(): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(location.origin + '-BSP-vault'),
        'PBKDF2',
        false,
        ['deriveKey']
    )
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: ENCRYPTION_SALT, iterations: 100_000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    )
}

async function encryptValue(plaintext: string): Promise<{ iv: string; data: string }> {
    const key = await deriveStorageKey()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(plaintext)
    )
    return {
        iv: btoa(String.fromCharCode(...iv)),
        data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    }
}

async function decryptValue(iv: string, data: string): Promise<string> {
    const key = await deriveStorageKey()
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0))
    const dataBytes = Uint8Array.from(atob(data), c => c.charCodeAt(0))
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivBytes },
        key,
        dataBytes
    )
    return new TextDecoder().decode(decrypted)
}

function getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 2)

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
    const encryptedKey = await encryptValue(privateKeyHex)

    const db = await getDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)

        const request = store.put({
            id: 'current_identity',
            domain,
            encryptedPrivateKey: encryptedKey,
            publicKeyHex,
            savedAt: new Date().toISOString(),
            version: 2,
        })

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}

export async function getIdentity(): Promise<{ domain: string, privateKeyHex: string, publicKeyHex: string } | null> {
    const db = await getDB()
    const record: any = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const request = store.get('current_identity')
        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)
    })

    if (!record) return null

    // v2: encrypted private key
    if (record.version === 2 && record.encryptedPrivateKey) {
        const privateKeyHex = await decryptValue(record.encryptedPrivateKey.iv, record.encryptedPrivateKey.data)
        return { domain: record.domain, privateKeyHex, publicKeyHex: record.publicKeyHex }
    }

    // v1 fallback: plaintext (auto-migrate on next save)
    if (record.privateKeyHex) {
        return { domain: record.domain, privateKeyHex: record.privateKeyHex, publicKeyHex: record.publicKeyHex }
    }

    return null
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
