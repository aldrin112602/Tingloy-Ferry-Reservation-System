import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Passenger, RouteProps, Schedule, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AdditionalPassengers from './components/book-ticket/AdditionalPassengers';
import BookingCompleteDisplay from './components/book-ticket/BookingCompleteDisplay';
import MainPassengerInformation from './components/book-ticket/MainPassengerInformation';
import { PassengerFareType } from './components/book-ticket/PassengerFareType';
import PaymentSection from './components/book-ticket/PaymentSection';
import TripSelection from './components/book-ticket/TripSelection';

export default function BookTicket({ routes }: { routes: RouteProps[] }) {
    const [step, setStep] = useState(1);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [additionalPassengers, setAdditionalPassengers] = useState<Passenger[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('gcash');
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [bookingReference, setBookingReference] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use Inertia form helper
    const form = useForm({
        route_id: '',
        full_name: '',
        age: '',
        passenger_fare_type: '',
        contact_number: '',
        children_counts: 0,
        residency_status: 'non-resident',
        address: '',
        additional_passengers: [] as any[],
        payment_method: 'gcash',
        receipt_image: null as File | null,
    });

    useEffect(() => {
        const schedules: Schedule[] = routes.map((route: RouteProps) => {
            const dateObj = new Date(route.date_and_time);

            return {
                id: route.id,
                route: `${route.start_location} to ${route.end_location}`,
                time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: dateObj.toLocaleDateString(),
                available: route.capacity - route.seats_occupied,
            };
        }).filter(route => route.available > 0);

        setSchedules(schedules);
    }, [routes]);

    // Handle adding a passenger
    const addPassenger = (): void => {
        if (additionalPassengers.length < 9) {
            // Max 10 passengers including main passenger
            const newPassenger = {
                id: Date.now(),
                full_name: '',
                age: '',
                address: '',
                passenger_fare_type: '',
                contact_number: '',
                residency_status: 'non-resident',
                is_main_passenger: false,
            };

            setAdditionalPassengers([...additionalPassengers, newPassenger]);

            // Update the form data for Inertia
            const updatedPassengers = [
                ...form.data.additional_passengers,
                {
                    full_name: '',
                    age: '',
                    address: '',
                    passenger_fare_type: '',
                    contact_number: '',
                    residency_status: 'non-resident',
                    is_main_passenger: false,
                },
            ];

            form.setData('additional_passengers', updatedPassengers);
        }
    };

    // Handle removing a passenger
    const removePassenger = (id: number, index: number): void => {
        setAdditionalPassengers(additionalPassengers.filter((passenger) => passenger.id !== id));

        // Update the form data for Inertia
        const updatedPassengers = [...form.data.additional_passengers];
        updatedPassengers.splice(index, 1);
        form.setData('additional_passengers', updatedPassengers);
    };

    // Handle additional passenger info change
    const handlePassengerChange = (id: number, index: number, field: string, value: string): void => {
        setAdditionalPassengers(additionalPassengers.map((passenger) => (passenger.id === id ? { ...passenger, [field]: value } : passenger)));

        // Update the form data for Inertia
        const updatedPassengers = [...form.data.additional_passengers];
        updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };

        form.setData('additional_passengers', updatedPassengers);
    };

    // Handle receipt upload
    const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptImage(reader.result as string);
            };
            reader.readAsDataURL(files[0]);
            form.setData('receipt_image', files[0]);
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, boolean> = {};

        if (!form.data.full_name) newErrors.full_name = true;
        if (!form.data.route_id) newErrors.route_id = true;
        if (!form.data.age) newErrors.age = true;
        if (!form.data.contact_number) newErrors.contact_number = true;
        if (!form.data.address) newErrors.address = true;
        if (!form.data.passenger_fare_type) newErrors.passenger_fare_type = true;

        // Validate additional passengers
        const invalidPassengers = additionalPassengers.some((p) => !p.full_name || !p.age);
        if (invalidPassengers) newErrors.additional_passengers = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        if (step === 1) {
            if (validateForm()) {
                setStep(2);
            }
        } else if (step === 2) {
            setIsSubmitting(true);

            // Format the data for the backend
            const formData = new FormData();
            formData.append('route_id', form.data.route_id);
            formData.append('full_name', form.data.full_name);
            formData.append('children_counts', String(form.data.children_counts));
            formData.append('age', form.data.age);
            formData.append('contact_number', form.data.contact_number);
            formData.append('residency_status', form.data.residency_status);
            formData.append('address', form.data.address);
            formData.append('passenger_fare_type', form.data.passenger_fare_type);
            formData.append('payment_method', paymentMethod);

            form.data.additional_passengers.forEach((passenger, index) => {
                Object.keys(passenger).forEach((key) => {
                    formData.append(`additional_passengers[${index}][${key}]`, passenger[key]);
                });
            });

            if (form.data.receipt_image) {
                formData.append('receipt_image', form.data.receipt_image);
            }
            console.log(form.data);


            // Submit to backend
            axios
                .post(route('bookings.store'), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    console.log(response.data);

                    // Handle successful booking
                    setBookingReference(response.data.booking_reference || `FT-${Date.now().toString().slice(-8)}`);
                    setBookingComplete(true);
                })
                .catch((error) => {
                    console.error('Booking error:', error);
                    // Handle errors
                    if (error.response && error.response.data && error.response.data.errors) {
                        // Map backend validation errors to our format
                        const backendErrors = error.response.data.errors;
                        const frontendErrors: Record<string, boolean> = {};

                        Object.keys(backendErrors).forEach((key) => {
                            frontendErrors[key] = true;
                        });

                        setErrors(frontendErrors);
                    }

                    // Go back to first step if there are critical errors
                    if (error.response && error.response.status === 422) {
                        setStep(1);
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    // Breadcrumbs for AppLayout
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Book Ticket',
            href: '/book-ticket',
        },
    ];

    // Render success screen
    if (bookingComplete)
        return <BookingCompleteDisplay breadcrumbs={breadcrumbs} additionalPassengers={additionalPassengers} bookingReference={bookingReference} />;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Ferry Ticket" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="mx-auto w-full max-w-3xl">
                    <CardHeader>
                        <CardTitle>Book Ferry Ticket</CardTitle>
                        <CardDescription>
                            {step === 1 ? 'Select your trip and enter passenger information' : 'Review your booking and complete payment'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            {step === 1 ? (
                                <>
                                    {/* Trip Selection Section */}
                                    <TripSelection form={form} schedules={schedules} errors={errors} />
                                    {/* Passenger Fare Type */}
                                    <PassengerFareType form={form} errors={errors} />
                                    {/* Main Passenger Information */}
                                    <MainPassengerInformation form={form} errors={errors} />

                                    {/* Additional Passengers */}
                                    <AdditionalPassengers
                                        form={form}
                                        addPassenger={addPassenger}
                                        additionalPassengers={additionalPassengers}
                                        removePassenger={removePassenger}
                                        handlePassengerChange={handlePassengerChange}
                                        errors={errors}
                                    />
                                </>
                            ) : (
                                <PaymentSection
                                mainPassengerFare={form.data.passenger_fare_type}
                                    paymentMethod={paymentMethod}
                                    setPaymentMethod={setPaymentMethod}
                                    additionalPassengers={additionalPassengers}
                                    receiptImage={receiptImage}
                                    setReceiptImage={setReceiptImage}
                                    form={form}
                                    handleReceiptUpload={handleReceiptUpload}
                                />
                            )}

                            <div className="mt-8 flex justify-between">
                                {step === 2 && (
                                    <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                                        Back
                                    </Button>
                                )}
                                <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                                    {isSubmitting ? 'Please wait...' : step === 1 ? 'Continue to Payment' : 'Complete Booking'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
