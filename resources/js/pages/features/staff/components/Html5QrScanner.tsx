import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

interface Html5QrScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: string) => void;
}

export const Html5QrScanner = ({ onScanSuccess, onScanFailure }: Html5QrScannerProps) => {
    const scannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            },
            /* verbose= */ false,
        );

        scanner.render(
            (decodedText) => {
                onScanSuccess(decodedText);
            },
            (errorMessage) => {
                if (onScanFailure) {
                    onScanFailure(errorMessage);
                }
            },
        );

        return () => {
            scanner.clear().catch((error) => console.error('Clear scanner error:', error));
        };
    }, []);

    return <div id="qr-reader" ref={scannerRef} />;
};
