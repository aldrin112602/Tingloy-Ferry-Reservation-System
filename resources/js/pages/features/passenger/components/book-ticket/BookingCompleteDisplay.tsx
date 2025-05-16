import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BookingCompleteDisplayProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Check } from 'lucide-react';

const BookingCompleteDisplay = ({ breadcrumbs, additionalPassengers, bookingReference }: BookingCompleteDisplayProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Submitted" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Booking Submitted Successfully!</CardTitle>
                        <CardDescription className="text-center">Your booking request has been received and is pending approval.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center pb-4">
                        <div className="mt-6 text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <Check className="h-8 w-8 text-green-600" />
                            </div>

                            <p className="text-lg font-semibold">Booking Reference: {bookingReference}</p>
                            <p className="text-muted-foreground mt-1">Total Passengers: {additionalPassengers.length + 1}</p>

                            <Alert className="mt-6 text-left">
                                <AlertTitle>What happens next?</AlertTitle>
                                <AlertDescription>
                                    <ul className="mt-2 list-disc space-y-1 pl-5">
                                        <li>Your booking request will be reviewed by our staff.</li>
                                        <li>Once approved, you will receive an email with your QR code ticket.</li>
                                        <li>Please check your email regularly and keep your booking reference for future inquiries.</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4">
                        <Button asChild>
                            <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/passenger/bookings">View My Bookings</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
};

export default BookingCompleteDisplay;
