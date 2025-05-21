import { Html5QrScannerProps } from '@/types';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import '../../../../assets/css/Qr.css'; 

export const Html5QrScanner = ({ onScanSuccess, onScanFailure }: Html5QrScannerProps) => {
    const scannerRef = useRef<HTMLDivElement>(null);
    const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const qrScanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            },
            false
        );

        setScanner(qrScanner);
        qrScanner.render(
            (decodedText) => {
                setIsScanning(false);
                onScanSuccess(decodedText);
                setTimeout(() => {
                    resetScanner();
                }, 2000);
            },
            (errorMessage) => {
                if (onScanFailure) {
                    onScanFailure(errorMessage);
                }
            }
        );
        return () => {
            if (qrScanner) {
                qrScanner.clear().catch((error) => console.error('Clear scanner error:', error));
            }
        };
    }, []);

    const resetScanner = () => {
        if (scanner) {
            scanner.clear().then(() => {
                scanner.render(
                    (decodedText) => {
                        setIsScanning(false);
                        onScanSuccess(decodedText);
                        setTimeout(() => {
                            resetScanner();
                        }, 2000);
                    },
                    (errorMessage) => {
                        if (onScanFailure) {
                            onScanFailure(errorMessage);
                        }
                    }
                );
                setIsScanning(true);
            }).catch(error => {
                console.error('Error resetting scanner:', error);
            });
        }
    };

    return <div id="qr-reader" ref={scannerRef} />;
};