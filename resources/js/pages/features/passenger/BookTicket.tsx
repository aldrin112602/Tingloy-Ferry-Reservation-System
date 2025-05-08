import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Ferry, Passenger, Schedule, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

import axios from 'axios';
import { Check, Plus, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';



export default function BookTicket() {
    const [step, setStep] = useState(1);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [additionalPassengers, setAdditionalPassengers] = useState<Passenger[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('gcash');
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [bookingReference, setBookingReference] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use Inertia form helper
    const form = useForm({
        route_id: '',
        full_name: '',
        age: '',
        contact_number: '',
        residency_status: 'non-resident',
        address: '',
        additional_passengers: [] as any[],
        payment_method: 'gcash',
        receipt_image: null as File | null,
    });

    useEffect(() => {
        axios
            .get(route('passenger.routes'))
            .then((response) => {
                const schedules: Schedule[] = response.data.map((ferry: Ferry) => {
                    const dateObj = new Date(ferry.date_and_time);

                    return {
                        id: ferry.id,
                        route: `${ferry.start_location} to ${ferry.end_location}`,
                        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: dateObj.toLocaleDateString(), // or manually format if needed
                        available: ferry.capacity - ferry.seats_occupied,
                    };
                });

                setSchedules(schedules);
            })
            .catch((error) => {
                console.error('Error fetching routes:', error);
            });
    }, []);

    // Handle adding a passenger
    const addPassenger = () => {
        if (additionalPassengers.length < 9) {
            // Max 10 passengers including main passenger
            const newPassenger = {
                id: Date.now(),
                full_name: '',
                age: '',
                address: '',
                contact_number: '',
                residency_status: 'non-resident',
            };

            setAdditionalPassengers([...additionalPassengers, newPassenger]);

            // Update the form data for Inertia
            const updatedPassengers = [
                ...form.data.additional_passengers,
                {
                    full_name: '',
                    age: '',
                    address: '',
                    contact_number: '',
                    residency_status: 'non-resident',
                },
            ];

            form.setData('additional_passengers', updatedPassengers);
        }
    };

    // Handle removing a passenger
    const removePassenger = (id: number, index: number) => {
        setAdditionalPassengers(additionalPassengers.filter((passenger) => passenger.id !== id));

        // Update the form data for Inertia
        const updatedPassengers = [...form.data.additional_passengers];
        updatedPassengers.splice(index, 1);
        form.setData('additional_passengers', updatedPassengers);
    };

    // Handle additional passenger info change
    const handlePassengerChange = (id: number, index: number, field: string, value: string) => {
        setAdditionalPassengers(additionalPassengers.map((passenger) => (passenger.id === id ? { ...passenger, [field]: value } : passenger)));

        // Update the form data for Inertia
        const updatedPassengers = [...form.data.additional_passengers];
        updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };

        
        form.setData('additional_passengers', updatedPassengers);
    };

    // Handle receipt upload
    const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const validateForm = () => {
        const newErrors: Record<string, boolean> = {};

        if (!form.data.full_name) newErrors.full_name = true;
        if (!form.data.route_id) newErrors.route_id = true;
        if (!form.data.age) newErrors.age = true;
        if (!form.data.contact_number) newErrors.contact_number = true;
        if (!form.data.address) newErrors.address = true;

        // Validate additional passengers
        const invalidPassengers = additionalPassengers.some((p) => !p.full_name || !p.age);
        if (invalidPassengers) newErrors.additional_passengers = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
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
            formData.append('age', form.data.age);
            formData.append('contact_number', form.data.contact_number);
            formData.append('residency_status', form.data.residency_status);
            formData.append('address', form.data.address);
            formData.append('payment_method', paymentMethod);

            // Add additional passengers
            // formData.append('additional_passengers', JSON.stringify(form.data.additional_passengers));
            form.data.additional_passengers.forEach((passenger, index) => {
                Object.keys(passenger).forEach(key => {
                    formData.append(`additional_passengers[${index}][${key}]`, passenger[key]);
                });
            });

            // Add receipt image if available
            if (form.data.receipt_image) {
                formData.append('receipt_image', form.data.receipt_image);
            }
            console.log(form.data)
            
            // Submit to backend
            axios
                .post(route('bookings.store'), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    
                    // Handle successful booking
                    setBookingReference(response.data.booking_reference || `FT-${Date.now().toString().slice(-8)}`);

                    // Generate QR code with booking reference
                    const qrData = JSON.stringify({
                        bookingId: response.data.booking_reference,
                        passengerCount: additionalPassengers.length + 1,
                        mainPassenger: form.data.full_name,
                        tripId: form.data.route_id,
                        timestamp: new Date().toISOString(),
                    });

                    setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(qrData));

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

    // Render success screen with QR code
    if (bookingComplete) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Booking Confirmed" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <Card className="mx-auto w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl">Booking Successful!</CardTitle>
                            <CardDescription className="text-center">Your ferry ticket has been confirmed.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pb-4">
                            <div className="rounded-lg bg-white p-2 shadow-sm">
                                <img src={qrCode || ''} alt="QR Code" className="h-64 w-64" />
                            </div>
                            <div className="mt-6 text-center">
                                <p className="font-semibold">Booking Reference: {bookingReference}</p>
                                <p className="text-muted-foreground mt-1">Total Passengers: {additionalPassengers.length + 1}</p>
                                <Alert className="mt-4">
                                    <Check className="h-4 w-4" />
                                    <AlertTitle>Important</AlertTitle>
                                    <AlertDescription>Please save or screenshot this QR code. It will be required for boarding.</AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center gap-4">
                            <Button onClick={() => window.print()}>Print Ticket</Button>
                            <Button variant="outline" asChild>
                                <Link href="/dashboard">Back to Dashboard</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </AppLayout>
        );
    }

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
                                    <div className="mb-6">
                                        <Label htmlFor="route_id" className="text-lg font-medium">
                                            Select Trip
                                        </Label>
                                        <Select value={form.data.route_id} onValueChange={(value) => form.setData('route_id', value)}>
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select a scheduled trip" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {schedules.map((schedule) => (
                                                    <SelectItem key={schedule.id} value={schedule.id.toString()}>
                                                        {schedule.route} - {schedule.time} ({schedule.date}) - {schedule.available} seats available
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.route_id && <p className="mt-1 text-sm text-red-500">Please select a trip</p>}
                                    </div>

                                    {/* Main Passenger Information */}
                                    <div className="mb-6">
                                        <h3 className="mb-4 text-lg font-medium">Main Passenger Information</h3>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="full_name">Full Name</Label>
                                                <Input
                                                    id="full_name"
                                                    value={form.data.full_name}
                                                    onChange={(e) => form.setData('full_name', e.target.value)}
                                                />
                                                {errors.full_name && <p className="text-sm text-red-500">Required</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="age">Age</Label>
                                                <Input
                                                    id="age"
                                                    type="number"
                                                    value={form.data.age}
                                                    onChange={(e) => form.setData('age', e.target.value)}
                                                />
                                                {errors.age && <p className="text-sm text-red-500">Required</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contact_number">Contact Number</Label>
                                                <Input
                                                    id="contact_number"
                                                    value={form.data.contact_number}
                                                    onChange={(e) => form.setData('contact_number', e.target.value)}
                                                />
                                                {errors.contact_number && <p className="text-sm text-red-500">Required</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="residency_status">Residency Status</Label>
                                                <Select
                                                    value={form.data.residency_status}
                                                    onValueChange={(value) => form.setData('residency_status', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="resident">Resident</SelectItem>
                                                        <SelectItem value="non-resident">Non-resident</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <Label htmlFor="address">Address</Label>
                                                <Textarea
                                                    id="address"
                                                    value={form.data.address}
                                                    onChange={(e) => form.setData('address', e.target.value)}
                                                />
                                                {errors.address && <p className="text-sm text-red-500">Required</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Passengers */}
                                    <div className="mb-6">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-lg font-medium">Additional Passengers</h3>
                                            <Button type="button" onClick={addPassenger} variant="outline" size="sm">
                                                <Plus className="mr-1 h-4 w-4" /> Add Passenger
                                            </Button>
                                        </div>

                                        {additionalPassengers.length === 0 && (
                                            <p className="text-muted-foreground text-sm">No additional passengers added.</p>
                                        )}

                                        {additionalPassengers.map((passenger, index) => (
                                            <div key={passenger.id} className="mb-4 rounded-md border p-4">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <h4 className="font-medium">Passenger {index + 2}</h4>
                                                    <Button
                                                        type="button"
                                                        onClick={() => removePassenger(passenger.id, index)}
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label>Full Name</Label>
                                                        <Input
                                                            value={passenger.full_name}
                                                            onChange={(e) => handlePassengerChange(passenger.id, index, 'full_name', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Age</Label>
                                                        <Input
                                                            type="number"
                                                            value={passenger.age}
                                                            onChange={(e) => handlePassengerChange(passenger.id, index, 'age', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Contact Number</Label>
                                                        <Input
                                                            value={passenger.contact_number}
                                                            onChange={(e) =>
                                                                handlePassengerChange(passenger.id, index, 'contact_number', e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Residency Status</Label>
                                                        <Select
                                                            value={passenger.residency_status}
                                                            onValueChange={(value) =>
                                                                handlePassengerChange(passenger.id, index, 'residency_status', value)
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="resident">Resident</SelectItem>
                                                                <SelectItem value="non-resident">Non-resident</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="col-span-2 space-y-2">
                                                        <Label>Address</Label>
                                                        <Textarea
                                                            value={passenger.address}
                                                            onChange={(e) => handlePassengerChange(passenger.id, index, 'address', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {errors.additional_passengers && (
                                            <p className="mt-1 text-sm text-red-500">All passenger information must be complete</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Payment Section */}
                                    <div className="mb-6">
                                        <h3 className="mb-4 text-lg font-medium">Payment Method</h3>
                                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="gcash" id="gcash" />
                                                <Label htmlFor="gcash">GCash (Upload Receipt)</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="cash" id="cash" />
                                                <Label htmlFor="cash">Cash (Pay at Terminal)</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {paymentMethod === 'gcash' && (
                                        <div className="mb-6">
                                            <h3 className="mb-2 text-lg font-medium">GCash Payment</h3>
                                            <p className="text-muted-foreground mb-4">
                                                Please send payment to: 09123456789 (Juan Dela Cruz)
                                                <br />
                                                Amount: ₱{(additionalPassengers.length + 1) * 100}.00
                                            </p>

                                            <div className="mb-4 flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6">
                                                {receiptImage ? (
                                                    <div className="relative">
                                                        <img src={receiptImage} alt="Receipt" className="max-h-48 rounded-md" />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute top-0 right-0 rounded-full bg-white p-1"
                                                            onClick={() => {
                                                                setReceiptImage(null);
                                                                form.setData('receipt_image', null);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="text-muted-foreground mb-2 h-10 w-10" />
                                                        <p className="text-muted-foreground mb-2 text-center text-sm">
                                                            Click or drag to upload your GCash receipt
                                                        </p>
                                                        <Input type="file" accept="image/*" className="max-w-xs" onChange={handleReceiptUpload} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'cash' && (
                                        <Alert>
                                            <AlertTitle>Cash Payment Selected</AlertTitle>
                                            <AlertDescription>
                                                Payment will be collected at the terminal before boarding.
                                                <br />
                                                Amount Due: ₱{(additionalPassengers.length + 1) * 100}.00
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Booking Summary */}
                                    <div className="mb-6">
                                        <h3 className="mb-4 text-lg font-medium">Booking Summary</h3>
                                        <div className="bg-muted rounded-md p-4">
                                            <div className="mb-2 flex justify-between">
                                                <span>Main Passenger:</span>
                                                <span className="font-medium">1</span>
                                            </div>
                                            <div className="mb-2 flex justify-between">
                                                <span>Additional Passengers:</span>
                                                <span className="font-medium">{additionalPassengers.length}</span>
                                            </div>
                                            <div className="mb-2 flex justify-between">
                                                <span>Total Passengers:</span>
                                                <span className="font-medium">{additionalPassengers.length + 1}</span>
                                            </div>
                                            <div className="mt-2 flex justify-between border-t pt-2">
                                                <span className="font-medium">Total Amount:</span>
                                                <span className="font-bold">₱{(additionalPassengers.length + 1) * 100}.00</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
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
