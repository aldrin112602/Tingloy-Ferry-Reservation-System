import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioItem } from '@radix-ui/react-dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, Trash2, Upload, Check } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

export default function BookTicket() {
  // Main passenger states
  const [step, setStep] = useState(1);
  
  interface Passenger {
    id: number;
    name: string;
    age: string;
    address: string;
    contact: string;
    residencyStatus: string;
  }

  const [additionalPassengers, setAdditionalPassengers] = useState<Passenger[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  // Form data object to store form values
  const [formData, setFormData] = useState({
    name: '',
    tripId: '',
    age: '',
    contact: '',
    residencyStatus: 'non-resident',
    address: ''
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Ferry schedules - This would come from your API in a real application
  const schedules = [
    { id: 1, route: 'Mabini to Tingloy', time: '09:00 AM', date: '2025-04-25', available: 198 },
    { id: 2, route: 'Mabini to Tingloy', time: '01:00 PM', date: '2025-04-25', available: 205 },
    { id: 3, route: 'Tingloy to Mabini', time: '11:00 AM', date: '2025-04-25', available: 180 },
    { id: 4, route: 'Tingloy to Mabini', time: '04:00 PM', date: '2025-04-25', available: 210 },
  ];

  // Handle adding a passenger
  const addPassenger = () => {
    if (additionalPassengers.length < 9) { // Max 10 passengers including main passenger
      setAdditionalPassengers([...additionalPassengers, {
        id: Date.now(),
        name: '',
        age: '',
        address: '',
        contact: '',
        residencyStatus: 'non-resident'
      }]);
    }
  };

  // Handle removing a passenger
  const removePassenger = (id: number) => {
    setAdditionalPassengers(additionalPassengers.filter(passenger => passenger.id !== id));
  };

  // Handle additional passenger info change
  const handlePassengerChange = (id: number, field: string, value: string) => {
    setAdditionalPassengers(additionalPassengers.map(passenger => 
      passenger.id === id ? { ...passenger, [field]: value } : passenger
    ));
  };

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.name) newErrors.name = true;
    if (!formData.tripId) newErrors.tripId = true;
    if (!formData.age) newErrors.age = true;
    if (!formData.contact) newErrors.contact = true;
    if (!formData.address) newErrors.address = true;
    
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
      // In real implementation: send data to backend, process payment, generate QR
      console.log("Booking data:", { 
        mainPassenger: formData, 
        additionalPassengers, 
        paymentMethod, 
        receiptImage 
      });
      
      // Simulate QR code generation after successful booking
      setTimeout(() => {
        setQrCode("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(JSON.stringify({
          bookingId: "TFS-" + Date.now(),
          passengerCount: additionalPassengers.length + 1,
          mainPassenger: formData.name,
          tripId: formData.tripId,
          timestamp: new Date().toISOString()
        })));
        setBookingComplete(true);
      }, 1500);
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
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Booking Successful!</CardTitle>
              <CardDescription className="text-center">Your ferry ticket has been confirmed.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pb-4">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <img src={qrCode || ''} alt="QR Code" className="w-64 h-64" />
              </div>
              <div className="mt-6 text-center">
                <p className="font-semibold">Booking Reference: TFS-{Date.now().toString().slice(-8)}</p>
                <p className="text-muted-foreground mt-1">
                  Total Passengers: {additionalPassengers.length + 1}
                </p>
                <Alert className="mt-4">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Please save or screenshot this QR code. It will be required for boarding.
                  </AlertDescription>
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
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Book Ferry Ticket</CardTitle>
            <CardDescription>
              {step === 1 ? 
                "Select your trip and enter passenger information" : 
                "Review your booking and complete payment"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <>
                  {/* Trip Selection Section */}
                  <div className="mb-6">
                    <Label htmlFor="tripId" className="text-lg font-medium">Select Trip</Label>
                    <Select 
                      value={formData.tripId}
                      onValueChange={(value) => handleSelectChange('tripId', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a scheduled trip" />
                      </SelectTrigger>
                      <SelectContent>
                        {schedules.map(schedule => (
                          <SelectItem key={schedule.id} value={schedule.id.toString()}>
                            {schedule.route} - {schedule.time} ({schedule.date}) - {schedule.available} seats available
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tripId && <p className="text-red-500 text-sm mt-1">Please select a trip</p>}
                  </div>

                  {/* Main Passenger Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Main Passenger Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {errors.name && <p className="text-red-500 text-sm">Required</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input 
                          id="age" 
                          type="number" 
                          value={formData.age}
                          onChange={handleInputChange}
                        />
                        {errors.age && <p className="text-red-500 text-sm">Required</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input 
                          id="contact" 
                          value={formData.contact}
                          onChange={handleInputChange}
                        />
                        {errors.contact && <p className="text-red-500 text-sm">Required</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="residencyStatus">Residency Status</Label>
                        <Select 
                          value={formData.residencyStatus}
                          onValueChange={(value) => handleSelectChange('residencyStatus', value)}
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
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea 
                          id="address" 
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                        {errors.address && <p className="text-red-500 text-sm">Required</p>}
                      </div>
                    </div>
                  </div>

                  {/* Additional Passengers */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Additional Passengers</h3>
                      <Button type="button" onClick={addPassenger} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Add Passenger
                      </Button>
                    </div>
                    
                    {additionalPassengers.length === 0 && (
                      <p className="text-muted-foreground text-sm">No additional passengers added.</p>
                    )}

                    {additionalPassengers.map((passenger, index) => (
                      <div key={passenger.id} className="border rounded-md p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Passenger {index + 2}</h4>
                          <Button 
                            type="button" 
                            onClick={() => removePassenger(passenger.id)} 
                            variant="ghost" 
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input 
                              value={passenger.name} 
                              onChange={(e) => handlePassengerChange(passenger.id, 'name', e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Age</Label>
                            <Input 
                              type="number" 
                              value={passenger.age} 
                              onChange={(e) => handlePassengerChange(passenger.id, 'age', e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Contact Number</Label>
                            <Input 
                              value={passenger.contact} 
                              onChange={(e) => handlePassengerChange(passenger.id, 'contact', e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Residency Status</Label>
                            <Select 
                              value={passenger.residencyStatus}
                              onValueChange={(value) => handlePassengerChange(passenger.id, 'residencyStatus', value)}
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
                          <div className="space-y-2 col-span-2">
                            <Label>Address</Label>
                            <Textarea 
                              value={passenger.address} 
                              onChange={(e) => handlePassengerChange(passenger.id, 'address', e.target.value)} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Payment Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioItem value="gcash" id="gcash" />
                        <Label htmlFor="gcash">GCash (Upload Receipt)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioItem value="cash" id="cash" />
                        <Label htmlFor="cash">Cash (Pay at Terminal)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === 'gcash' && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">GCash Payment</h3>
                      <p className="text-muted-foreground mb-4">
                        Please send payment to: 09123456789 (Juan Dela Cruz)
                        <br />
                        Amount: ₱{(additionalPassengers.length + 1) * 100}.00
                      </p>
                      
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 mb-4">
                        {receiptImage ? (
                          <div className="relative">
                            <img 
                              src={receiptImage} 
                              alt="Receipt" 
                              className="max-h-48 rounded-md" 
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="absolute top-0 right-0 bg-white rounded-full p-1"
                              onClick={() => setReceiptImage(null)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-center text-muted-foreground mb-2">
                              Click or drag to upload your GCash receipt
                            </p>
                            <Input 
                              type="file" 
                              accept="image/*" 
                              className="max-w-xs" 
                              onChange={handleReceiptUpload} 
                            />
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
                    <h3 className="text-lg font-medium mb-4">Booking Summary</h3>
                    <div className="bg-muted rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <span>Main Passenger:</span>
                        <span className="font-medium">1</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Additional Passengers:</span>
                        <span className="font-medium">{additionalPassengers.length}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Total Passengers:</span>
                        <span className="font-medium">{additionalPassengers.length + 1}</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold">₱{(additionalPassengers.length + 1) * 100}.00</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between mt-8">
                {step === 2 && (
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                )}
                <Button type="submit" className="ml-auto">
                  {step === 1 ? 'Continue to Payment' : 'Complete Booking'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}