import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MainPassengerInformationProps } from '@/types';

export const fareTypes = [
    { id: 1, name: 'Full fare', price: 160 },
    { id: 2, name: 'Senior/PWD with valid ID', price: 104 },
    { id: 3, name: 'Student with valid ID', price: 116 },
    { id: 4, name: 'Children 3ys-12yrs old', price: 72 },
];

export const PassengerFareType = ({ form, errors }: MainPassengerInformationProps) => {
    // Determine if the currently selected fare type requires an ID
    const requiresIdUpload =
        form.data.passenger_fare_type === 'Senior/PWD with valid ID' ||
        form.data.passenger_fare_type === 'Student with valid ID';

    // Find the currently selected fare type object to get its price
    const selectedFare = fareTypes.find(fare => fare.name === form.data.passenger_fare_type);

    return (
        <>
            <div className="mb-6">
                <Label htmlFor="passenger_fare_type" className="text-lg font-medium">
                    Select Passenger Fare Type
                </Label>
                <Select
                    value={form.data.passenger_fare_type}
                    onValueChange={(value) => {
                        form.setData('passenger_fare_type', value);
                        if(!selectedFare) {
                            form.setData('id_file', null); 
                        }
                    }}
                >
                    <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select fare type" />
                    </SelectTrigger>
                    <SelectContent>
                        {fareTypes.map((fare) => (
                            <SelectItem key={fare.id} value={fare.name}>
                                {fare.name} - PHP {fare.price}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.passenger_fare_type && <p className="mt-1 text-sm text-red-500">Please select a passenger fare type</p>}
            </div>

            {/* Separate Pricing Details Display */}
            {selectedFare && (
                <div className="mb-6 rounded-md border border-gray-200 p-4 shadow-sm dark:border-gray-700">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                        Fare Details
                    </h4>
                    <div className="mt-2 text-gray-600 dark:text-gray-400">
                        <p className="flex justify-between items-center">
                            <span className="font-medium">Selected Fare:</span>
                            <span>{selectedFare.name}</span>
                        </p>
                        <p className="flex justify-between items-center mt-1">
                            <span className="font-medium">Price per person:</span>
                            <span className="text-lg font-bold text-blue-600">
                                PHP {selectedFare.price}
                            </span>
                        </p>
                    </div>
                </div>
            )}

            {/* Conditionally render the file upload input */}
            {requiresIdUpload && (
                <div className="mb-6">
                    <Label htmlFor="id_upload" className="text-lg font-medium">
                        Upload Valid ID
                    </Label>
                    <Input
                        type="file"
                        id="id_upload"
                        className="mt-2"
                        accept='image/*'
                        onChange={(e) => form.setData('id_file', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    />
                    {errors.id_file && <p className="mt-1 text-sm text-red-500">Please upload a Valid ID</p>}
                </div>
            )}
        </>
    );
};