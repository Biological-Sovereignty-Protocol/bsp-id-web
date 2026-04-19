import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'BSP Identity - Biological Sovereignty Protocol'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: '#60a5fa',
                            letterSpacing: '0.2em',
                            marginBottom: 20,
                            textTransform: 'uppercase',
                        }}
                    >
                        Biological Sovereignty Protocol
                    </div>
                    <h1
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            color: '#ffffff',
                            marginBottom: 30,
                            lineHeight: 1.1,
                        }}
                    >
                        BSP Identity
                    </h1>
                    <p
                        style={{
                            fontSize: 32,
                            color: '#cbd5e1',
                            maxWidth: 800,
                            lineHeight: 1.4,
                        }}
                    >
                        Create and manage your sovereign biological identity on Aptos
                    </p>
                    <div
                        style={{
                            marginTop: 40,
                            padding: '16px 32px',
                            background: '#60a5fa',
                            borderRadius: 12,
                            color: '#0f172a',
                            fontSize: 24,
                            fontWeight: 700,
                        }}
                    >
                        Get Started →
                    </div>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        fontSize: 18,
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    🔐 Sovereign • 🧬 Encrypted • ⛓️ On-Chain
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
