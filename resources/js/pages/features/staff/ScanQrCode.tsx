import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Html5QrScanner } from './components/Html5QrScanner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Scan QR code',
        href: 'staff/scan_qr',
    },
];

const ScanQrCode = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const processingRef = useRef(false);
    const [canMarkAsPaid, setCanMarkAsPaid] = useState(false);
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleScanSuccess = async (result: string) => {
        if (isSubmitting || processingRef.current) return;

        setIsSubmitting(true);
        processingRef.current = true;

        try {
            const response = await axios.post(route('qr.validation'), {
                data: result,
            });

            toast.success(response.data.message);
            setCanMarkAsPaid(false);
            setBookingId(null);

            setTimeout(() => {
                processingRef.current = false;
            }, 1000);
        } catch (error: any) {
            console.error('QR submission failed:', error);
            if (error.response && error.response.status === 422) {
                toast.error(error.response.data.message);
                if (error.response.data.can_mark_as_paid) {
                    setCanMarkAsPaid(true);
                    setBookingId(error.response.data.booking_id);
                }
            } else {
                toast.error('An error occurred while processing the QR code. Please try again.');
            }
            processingRef.current = false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const markBookingAsPaid = async () => {
        if (!bookingId) return;
        try {
            const res = await axios.post(route('booking.paid', bookingId));
            toast.success(res.data.message);
            setCanMarkAsPaid(false);
            setBookingId(null);
            setOpenDialog(false);
        } catch (err) {
            toast.error('Failed to update payment status.');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan QR Code" />
            <div className="mx-auto max-w-md py-5">
                {canMarkAsPaid && bookingId && (
                    <div className="bg-rose-100 p-4 text-rose-500 rounded-t-sm">
                        <p>This booking can be marked as paid.</p>
                        <div className="mt-2">
                            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                <DialogTrigger asChild>
                                    <Button>Mark as Paid</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Confirm Payment</DialogTitle>
                                    </DialogHeader>
                                    <p>Are you sure you want to mark this booking as paid?</p>
                                    <DialogFooter className="mt-4">
                                        <Button variant="outline" onClick={() => setOpenDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={markBookingAsPaid}>Confirm</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}

                <Html5QrScanner onScanSuccess={handleScanSuccess} />
            </div>
        </AppLayout>
    );
};

export default ScanQrCode;
