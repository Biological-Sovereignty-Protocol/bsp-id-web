import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'BSP Identity — Biological Sovereignty Protocol';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 64,
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
                        fontSize: 80,
                        fontWeight: 900,
                        color: '#e0f2fe',
                        marginBottom: 20,
                        textAlign: 'center',
                        lineHeight: 1.2,
                    }}
                >
                    BSP Identity
                </div>
                <div
                    style={{
                        fontSize: 32,
                        color: '#7dd3fc',
                        textAlign: 'center',
                        maxWidth: 800,
                        lineHeight: 1.4,
                    }}
                >
                    Biological Sovereignty Protocol
                </div>
                <div
                    style={{
                        fontSize: 24,
                        color: '#cbd5e1',
                        marginTop: 40,
                        textAlign: 'center',
                    }}
                >
                    Create and manage your sovereign biological identity
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
