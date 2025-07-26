import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MainPassengerInformationProps } from '@/types';

const MainPassengerInformation = ({ form, errors }: MainPassengerInformationProps) => {
    return (
        <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium">Main Passenger Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" value={form.data.full_name} onChange={(e) => form.setData('full_name', e.target.value)} />
                    {errors.full_name && <p className="text-sm text-red-500">Required</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" value={form.data.age} onChange={(e) => form.setData('age', e.target.value)} />
                    {errors.age && <p className="text-sm text-red-500">Required</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input id="contact_number" value={form.data.contact_number} onChange={(e) => form.setData('contact_number', e.target.value)} />
                    {errors.contact_number && <p className="text-sm text-red-500">Required</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="residency_status">Residency Status</Label>
                    <Select value={form.data.residency_status} onValueChange={(value) => form.setData('residency_status', value)}>
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
                    <Label htmlFor="children_counts">
                        Number of Children (Ages 0–6, if any)
                    </Label>
                    <Input
                        id="children_counts"
                        type="number"
                        min="0"
                        value={form.data.children_counts}
                        onChange={(e) => form.setData('children_counts', Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                        Please indicate how many young children (0–6 years old) are traveling with this passenger.
                    </p>
                    {errors.children_counts && (
                        <p className="text-sm text-red-500">{errors.children_counts}</p>
                    )}
                </div>


                <div className="space-y-2">
                    <Label htmlFor="childrens_contact_person">Childrens Contact Person (Optional)</Label>
                    <Input
                        id="childrens_contact_person"
                        value={form.data.childrens_contact_person}
                        onChange={(e) => form.setData('childrens_contact_person', e.target.value)}
                    />
                    {errors.childrens_contact_person && <p className="text-sm text-red-500">Required</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="childrens_contact_number">Childrens Contact Number (Optional)</Label>
                    <Input
                        id="childrens_contact_number"
                        value={form.data.childrens_contact_number}
                        onChange={(e) => form.setData('childrens_contact_number', e.target.value)}
                    />
                    {errors.childrens_contact_number && <p className="text-sm text-red-500">Required</p>}
                </div>

                <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} />
                    {errors.address && <p className="text-sm text-red-500">Required</p>}
                </div>
            </div>
        </div>
    );
};

export default MainPassengerInformation;
