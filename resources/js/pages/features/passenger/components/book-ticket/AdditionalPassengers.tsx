import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AdditionalPassengerProps } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import PassengerFareType from './PassengerFareType';

const AdditionalPassengers = ({ addPassenger, additionalPassengers, removePassenger, handlePassengerChange, form, errors }: AdditionalPassengerProps) => {
    return (
        <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Additional Passengers</h3>
                <Button type="button" onClick={addPassenger} variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Add Passenger
                </Button>
            </div>

            {additionalPassengers.length === 0 && <p className="text-muted-foreground text-sm">No additional passengers added.</p>}

            {additionalPassengers.map((passenger, index) => (
                <div key={passenger.id} className="mb-4 rounded-md border p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">Passenger {index + 2}</h4>
                        <Button type="button" onClick={() => removePassenger(passenger.id, index)} variant="ghost" size="sm">
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
                                onChange={(e) => handlePassengerChange(passenger.id, index, 'contact_number', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Residency Status</Label>
                            <Select
                                value={passenger.residency_status}
                                onValueChange={(value) => handlePassengerChange(passenger.id, index, 'residency_status', value)}
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

                        <div className="col-span-2 space-y-2">
                            <PassengerFareType isLabel={true} form={form} errors={errors} />
                        </div>


                        
                    </div>
                </div>
            ))}
            {errors.additional_passengers && <p className="mt-1 text-sm text-red-500">All passenger information must be complete</p>}
        </div>
    );
};

export default AdditionalPassengers;
