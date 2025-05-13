import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Html5QrScanner } from './components/Html5QrScanner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Scan QR code',
        href: 'staff/scan_qr',
    },
];

const ScanQrCode = () => {
    const handleScanSuccess = (result: string) => {
        console.log('Scanned result:', result);
        
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan QR Code" />
            <div className="mx-auto max-w-md py-5">
                <Html5QrScanner onScanSuccess={handleScanSuccess} />
            </div>
        </AppLayout>
    );
};

export default ScanQrCode;
