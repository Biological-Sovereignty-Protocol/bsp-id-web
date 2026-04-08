/**
 * BSP Key Export / Import
 *
 * Exporta a chave privada Ed25519 cifrada com AES-256-GCM + PBKDF2-SHA256 (1M iterações).
 * A chave NUNCA sai em texto claro — apenas o arquivo cifrado é produzido.
 *
 * Formato do arquivo .bspkey:
 * {
 *   "version": 1,
 *   "protocol": "BSP",
 *   "domain": "alice.bsp",
 *   "algorithm": "AES-256-GCM",
 *   "kdf": "PBKDF2-SHA256-1000000",
 *   "salt": "<base64>",
 *   "iv": "<base64>",
 *   "data": "<base64>",       ← private key bytes cifrados
 *   "exported_at": "<ISO>"
 * }
 *
 * Segurança:
 * - Sem a senha, o arquivo é inútil (AES-GCM com tag de autenticação)
 * - PBKDF2 com 1M iterações dificulta ataques de força bruta
 * - salt e iv únicos por export — cada arquivo é diferente mesmo com a mesma chave
 */

// ── Helpers ────────────────────────────────────────────────────────────────

function toBuffer(arr: Uint8Array): ArrayBuffer {
    return arr.buffer.slice(arr.byteOffset, arr.byteOffset + arr.byteLength)
}

function bytesToBase64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes))
}

function base64ToBytes(b64: string): Uint8Array {
    const binStr = atob(b64)
    const bytes = new Uint8Array(binStr.length)
    for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i)
    return bytes
}

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
    }
    return bytes
}

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function deriveAESKey(password: string, salt: Uint8Array, usage: KeyUsage[]): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
        'raw', toBuffer(new TextEncoder().encode(password)),
        'PBKDF2', false, ['deriveKey']
    )
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: toBuffer(salt), iterations: 1_000_000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false, usage
    )
}

// ── Export ─────────────────────────────────────────────────────────────────

/**
 * Cifra a chave privada com a senha e retorna o conteúdo do arquivo JSON.
 * Chamar triggerFileDownload() logo depois para disparar o download.
 */
export async function exportKeyToFile(
    privateKeyHex: string,
    domain: string,
    password: string
): Promise<string> {
    if (!password || password.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres')
    }

    const salt      = crypto.getRandomValues(new Uint8Array(16))
    const iv        = crypto.getRandomValues(new Uint8Array(12))
    const aesKey    = await deriveAESKey(password, salt, ['encrypt'])
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: toBuffer(iv) },
        aesKey,
        toBuffer(hexToBytes(privateKeyHex))
    )

    return JSON.stringify({
        version:     1,
        protocol:    'BSP',
        domain,
        algorithm:   'AES-256-GCM',
        kdf:         'PBKDF2-SHA256-1000000',
        salt:        bytesToBase64(salt),
        iv:          bytesToBase64(iv),
        data:        bytesToBase64(new Uint8Array(encrypted)),
        exported_at: new Date().toISOString(),
    }, null, 2)
}

// ── Import ─────────────────────────────────────────────────────────────────

/**
 * Decifra um arquivo de backup BSP.
 * Lança erro se a senha estiver errada ou o arquivo corrompido.
 */
export async function importKeyFromFile(
    fileContent: string,
    password: string
): Promise<{ privateKeyHex: string; domain: string }> {
    let parsed: any
    try {
        parsed = JSON.parse(fileContent)
    } catch {
        throw new Error('Arquivo inválido — não é um JSON válido')
    }

    if (parsed.version !== 1 || parsed.protocol !== 'BSP') {
        throw new Error('Arquivo não reconhecido como backup BSP')
    }

    const salt   = base64ToBytes(parsed.salt)
    const iv     = base64ToBytes(parsed.iv)
    const data   = base64ToBytes(parsed.data)
    const aesKey = await deriveAESKey(password, salt, ['decrypt'])

    let decrypted: ArrayBuffer
    try {
        decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: toBuffer(iv) }, aesKey, toBuffer(data))
    } catch {
        throw new Error('Senha incorreta ou arquivo corrompido')
    }

    return {
        privateKeyHex: bytesToHex(new Uint8Array(decrypted)),
        domain:        parsed.domain,
    }
}

// ── Download helper ────────────────────────────────────────────────────────

export function triggerFileDownload(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
