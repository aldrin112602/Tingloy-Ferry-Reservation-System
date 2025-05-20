import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MainPassengerInformationProps } from '@/types';

export const fareTypes = [
    { id: 1, name: 'Full fare', price: 160 },
    { id: 2, name: 'Senior/PWD with valid ID', price: 104 },
    { id: 3, name: 'Student with valid ID', price: 116 },
    { id: 4, name: 'Children 3ys-12yrs old', price: 72 },
];

export const PassengerFareType = ({ form, errors }: MainPassengerInformationProps) => {
    return (
        <div className="mb-6">
            <Label htmlFor="passenger_fare_type" className="text-lg font-medium">
                Select Passenger Fare Type
            </Label>
            <Select value={form.data.passenger_fare_type} onValueChange={(value) => form.setData('passenger_fare_type', value)}>
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
    );
};
