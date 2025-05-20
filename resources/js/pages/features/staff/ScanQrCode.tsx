import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Html5QrScanner } from './components/Html5QrScanner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Scan QR code',
        href: 'staff/scan_qr',
    },
];

type ScanQrCodeForm = {
    data: string;
};

const ScanQrCode = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<ScanQrCodeForm>>({
        data: '',
    });

    const handleScanSuccess = (result: string) => {
        if (isSubmitting && processing && data.data) return;
        setData('data', result);
        setIsSubmitting(true);
        
        post(route('staff.validateQRscan'), {
            onFinish: () => {
                reset('data');
                setIsSubmitting(false);
            },
            onError: () => {
                reset('data');
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan QR Code" />
            <div className="mx-auto max-w-md py-5">
                <InputError message={errors.data} />
                <Html5QrScanner onScanSuccess={handleScanSuccess} />
            </div>
        </AppLayout>
    );
};

export default ScanQrCode;
