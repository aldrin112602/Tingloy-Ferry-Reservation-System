import { Passenger } from '@/types';

const BookingSummary = ({ additionalPassengers }: { additionalPassengers: Passenger[] }) => {
    return (
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
    );
};

export default BookingSummary;
