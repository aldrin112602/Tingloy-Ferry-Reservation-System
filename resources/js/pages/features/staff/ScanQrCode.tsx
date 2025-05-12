import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Scan QR code',
        href: 'staff/scan_qr',
    },
];

const ScanQrCode = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan QR Code" />
        </AppLayout>
    );
};

export default ScanQrCode;
