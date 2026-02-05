// components/events/CertificateTemplate.jsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // ✅ FIXED

const CertificateTemplate = React.forwardRef(({ registration, event }, ref) => {
    const participantName = registration?.user?.name || registration?.name || registration?.guestName || 'Participant Name';
    const eventTitle = event?.title || 'Event Title';
    const eventDate = event?.date ? new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Event Date';
    const role = registration?.role || 'participant';
    const credentialId = registration?.credentialId || 'CREDENTIAL-ID';

    // Format role nicely
    const roleLabel = role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // QR code URL for verification
    const verifyUrl = `${window.location.origin}/verify-certificate?id=${credentialId}`;

    return (
        <div
            ref={ref}
            style={{
                width: '1200px',
                height: '850px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '60px',
                fontFamily: 'Arial, sans-serif',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative Background Elements */}
            <div
                style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '400px',
                    height: '400px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '-150px',
                    left: '-150px',
                    width: '500px',
                    height: '500px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                }}
            />

            {/* Main Certificate Content */}
            <div
                style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '60px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    {/* Logo Circle */}
                    <div
                        style={{
                            width: '120px',
                            height: '120px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '50%',
                            margin: '0 auto 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '48px',
                            fontWeight: 'bold',
                            color: 'white',
                        }}
                    >
                        JDC
                    </div>

                    <h1
                        style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: '#1a202c',
                            margin: '0 0 10px 0',
                        }}
                    >
                        JUST Debate Club
                    </h1>
                    <p
                        style={{
                            fontSize: '16px',
                            color: '#718096',
                            margin: 0,
                        }}
                    >
                        Jashore University of Science & Technology
                    </p>
                </div>

                {/* Certificate Title */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2
                        style={{
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#667eea',
                            margin: '0 0 10px 0',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                        }}
                    >
                        Certificate of {roleLabel === 'Participant' ? 'Participation' : roleLabel}
                    </h2>
                    <div
                        style={{
                            width: '150px',
                            height: '4px',
                            background: 'linear-gradient(to right, #667eea, #764ba2)',
                            margin: '0 auto',
                        }}
                    />
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: '20px',
                            color: '#4a5568',
                            marginBottom: '30px',
                        }}
                    >
                        This is to certify that
                    </p>

                    <h3
                        style={{
                            textAlign: 'center',
                            fontSize: '48px',
                            fontWeight: 'bold',
                            color: '#1a202c',
                            margin: '0 0 10px 0',
                            borderBottom: '3px solid #667eea',
                            paddingBottom: '10px',
                            display: 'inline-block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                    >
                        {participantName}
                    </h3>

                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: '20px',
                            color: '#4a5568',
                            margin: '30px 0',
                        }}
                    >
                        has successfully participated as
                    </p>

                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '28px',
                            fontWeight: 'bold',
                            color: '#764ba2',
                            margin: '0 0 30px 0',
                        }}
                    >
                        {roleLabel}
                    </div>

                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: '20px',
                            color: '#4a5568',
                            marginBottom: '20px',
                        }}
                    >
                        in
                    </p>

                    <h4
                        style={{
                            textAlign: 'center',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: '#1a202c',
                            margin: '0 0 20px 0',
                        }}
                    >
                        {eventTitle}
                    </h4>

                    <p
                        style={{
                            textAlign: 'center',
                            fontSize: '18px',
                            color: '#718096',
                            margin: 0,
                        }}
                    >
                        held on {eventDate}
                    </p>
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginTop: '40px',
                        paddingTop: '30px',
                        borderTop: '2px solid #e2e8f0',
                    }}
                >
                    {/* QR Code */}
                    <div style={{ textAlign: 'center' }}>
                        <QRCodeSVG
                            value={verifyUrl}
                            size={80}
                            level="H"
                        />
                        <p
                            style={{
                                fontSize: '10px',
                                color: '#a0aec0',
                                marginTop: '8px',
                                marginBottom: '4px',
                            }}
                        >
                            Scan to verify
                        </p>
                        <p
                            style={{
                                fontSize: '9px',
                                color: '#cbd5e0',
                                margin: 0,
                                fontFamily: 'monospace',
                            }}
                        >
                            {credentialId}
                        </p>
                    </div>

                    {/* Date & Signature */}
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                borderTop: '2px solid #1a202c',
                                paddingTop: '10px',
                                minWidth: '250px',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#1a202c',
                                    margin: '0 0 5px 0',
                                }}
                            >
                                President
                            </p>
                            <p
                                style={{
                                    fontSize: '14px',
                                    color: '#718096',
                                    margin: 0,
                                }}
                            >
                                JUST Debate Club
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
