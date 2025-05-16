import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TripSelectionProps } from '@/types';

const TripSelection = ({ form, schedules, errors }: TripSelectionProps) => {
    return (
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
    );
};

export default TripSelection;
