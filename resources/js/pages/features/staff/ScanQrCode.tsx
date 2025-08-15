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
    const host = `${window.location.protocol}//${window.location.host}`;

    setIsSubmitting(true);
    processingRef.current = true;

    try {
        const response = await axios.post(route('qr.validation'), {
            data: result,
        });

        toast.success(response.data.message);
        setCanMarkAsPaid(false);
        setBookingId(null);

        const booking = response.data.booking;

        // Helper: Format date & time to AM/PM
        const formatDateTime = (dateStr: string) => {
            const date = new Date(dateStr);
            return date.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        };

        const passengerRows = booking.passengers.map((p: any, index: number) => `
            <tr>
                <td>${index + 1}</td>
                <td>${p.full_name}</td>
                <td>${p.age}</td>
                <td>${p.contact_number}</td>
                <td>${p.address}</td>
                <td>₱${p.passenger_fare}</td>
                <td>${p.passenger_fare_type}</td>
                <td>${p.residency_status}</td>
                <td>${p.is_main_passenger ? 'Yes' : 'No'}</td>
                <td>${p.id_file ? `<img src="${host}/storage/${p.id_file}" alt="ID" style="max-width:100px;">` : ''}</td>
            </tr>
        `).join("");

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Booking #${booking.ticket_code}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h2 { margin-top: 30px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
                        th { background: #f2f2f2; }
                        img { max-width: 120px; margin-top: 5px; }
                         button { height: 50px; width: 200px; background: #222; color: white; unset: all; }
                        @media print { button { display: none; }}
                        header { display: flex !important; align-items: center !important; justify-content: between !important; width: 100vw !important; }
                    </style>
                </head>
                <body>
                    <header>
                        <h1>Booking Information</h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button onclick="window.print()">Print Document</button>
                    </header>

                    <h2>Booking Details</h2>
                    <table>
                        <tr><th>Ticket Code</th><td>${booking.ticket_code}</td></tr>
                        <tr><th>Payment Method</th><td>${booking.payment_method}</td></tr>
                        <tr><th>Total Fee</th><td>₱${booking.total_fee}</td></tr>
                        <tr><th>Status</th><td>${booking.status}</td></tr>
                        <tr><th>Receipt Image</th><td><img src="${host}/storage/${booking.receipt_image}" alt="Receipt"></td></tr>
                    </table>

                    <h2>Route Details</h2>
                    <table>
                        <tr><th>Route Name</th><td>${booking.route.name}</td></tr>
                        <tr><th>Route Code</th><td>${booking.route.route_code}</td></tr>
                        <tr><th>From</th><td>${booking.route.start_location}</td></tr>
                        <tr><th>To</th><td>${booking.route.end_location}</td></tr>
                        <tr><th>Date & Time</th><td>${formatDateTime(booking.route.date_and_time)}</td></tr>
                        <tr><th>Capacity</th><td>${booking.route.capacity}</td></tr>
                    </table>

                    <h2>User Details</h2>
                    <table>
                        <tr><th>Name</th><td>${booking.user.name}</td></tr>
                        <tr><th>Email</th><td>${booking.user.email}</td></tr>
                        <tr><th>Address</th><td>${booking.user.address}</td></tr>
                        <tr><th>Birthdate</th><td>${booking.user.birthdate}</td></tr>
                        <tr><th>Role</th><td>${booking.user.role}</td></tr>
                    </table>

                    <h2>Passengers</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Age</th>
                                <th>Contact Number</th>
                                <th>Address</th>
                                <th>Fare</th>
                                <th>Fare Type</th>
                                <th>Residency</th>
                                <th>Main Passenger</th>
                                <th>ID Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${passengerRows}
                        </tbody>
                    </table>
                </body>
                </html>
            `);
        }

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



    // const handleScanSuccess = async (result: string) => {
    //     if (isSubmitting || processingRef.current) return;

    //     setIsSubmitting(true);
    //     processingRef.current = true;

    //     try {
    //         const response = await axios.post(route('qr.validation'), {
    //             data: result,
    //         });

    //         toast.success(response.data.message);
    //         setCanMarkAsPaid(false);
    //         setBookingId(null);

    //         setTimeout(() => {
    //             processingRef.current = false;
    //         }, 1000);
    //     } catch (error: any) {
    //         console.error('QR submission failed:', error);
    //         if (error.response && error.response.status === 422) {
    //             toast.error(error.response.data.message);
    //             if (error.response.data.can_mark_as_paid) {
    //                 setCanMarkAsPaid(true);
    //                 setBookingId(error.response.data.booking_id);
    //             }
    //         } else {
    //             toast.error('An error occurred while processing the QR code. Please try again.');
    //         }
    //         processingRef.current = false;
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    const markBookingAsPaid = async () => {
        if (!bookingId) return;
        try {
            const res = await axios.post(route('booking.paid', bookingId));
            toast.success(res.data.message);
            setCanMarkAsPaid(false);
            setBookingId(null);
            setOpenDialog(false);
        } catch (err) {
            console.log(err)
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
