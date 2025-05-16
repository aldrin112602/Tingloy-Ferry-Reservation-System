import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentSectionProps } from '@/types';
import { Trash2, Upload } from 'lucide-react';
import BookingSummary from './BookingSummary';

const PaymentSection = ({
    paymentMethod,
    setPaymentMethod,
    additionalPassengers,
    receiptImage,
    setReceiptImage,
    form,
    handleReceiptUpload,
}: PaymentSectionProps) => {
    return (
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
                                <p className="text-muted-foreground mb-2 text-center text-sm">Click or drag to upload your GCash receipt</p>
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
            <BookingSummary additionalPassengers={additionalPassengers} />
        </>
    );
};

export default PaymentSection;
