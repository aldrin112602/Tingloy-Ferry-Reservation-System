import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RouteProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EditRouteFormData {
    id: number;
    name: string;
    start_location: string;
    end_location: string;
    date_and_time: string;
    [key: string]: string | number;
}

interface EditScheduleProps {
    dialogRefEdit: React.RefObject<HTMLDialogElement | null>;
    routeObj: RouteProps;
}

const EditSchedule: React.FC<EditScheduleProps> = ({ dialogRefEdit, routeObj }) => {
    const formatDateTimeForInput = (dateTimeStr: string): string => {
        if (!dateTimeStr) return '';
        try {
            const date = new Date(dateTimeStr);
            return date.toISOString().slice(0, 16);
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const [formData, setFormData] = useState<EditRouteFormData>({
        id: routeObj?.id || 0,
        name: routeObj?.name || '',
        start_location: routeObj?.start_location || '',
        end_location: routeObj?.end_location || '',
        date_and_time: formatDateTimeForInput(routeObj?.date_and_time || ''),
    });

    useEffect(() => {
        if (routeObj) {
            setFormData({
                id: routeObj?.id || 0,
                name: routeObj.name || '',
                start_location: routeObj.start_location || '',
                end_location: routeObj.end_location || '',
                date_and_time: formatDateTimeForInput(routeObj.date_and_time || ''),
            });
            // console.log('Form data updated with:', routeObj);
        }
    }, [routeObj]);

    const { data, setData, put, processing, errors, reset } = useForm<EditRouteFormData>(formData);

    useEffect(() => {
        Object.entries(formData).forEach(([key, value]) => {
            setData(key as keyof EditRouteFormData, value);
        });
    }, [formData]);

    const closeEditRouteModal = () => {
        if (dialogRefEdit.current) {
            dialogRefEdit.current.close();
        }
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // console.log('Submitting form with data:', data);

        put(route('admin.schedule.put', { id: data.id }), {
            onSuccess: (response) => {
                console.log('Route updated successfully:', response);
                closeEditRouteModal();
            },
            onError: (error) => {
                console.error('Error updating route:', error);
            },
        });
    };

    const getRouteDisplayValue = () => {
        if (data.start_location && data.end_location) {
            return `${data.start_location} to ${data.end_location}`;
        }
        return '';
    };

    const handleRouteChange = (routeValue: string) => {
        if (routeValue) {
            const [start, end] = routeValue.split(' to ');
            setFormData((prev) => ({
                ...prev,
                start_location: start,
                end_location: end,
            }));
        }
    };

    return (
        <dialog ref={dialogRefEdit} className="mx-auto my-auto w-full max-w-md overflow-y-hidden rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Schedule</h2>
                <Button onClick={closeEditRouteModal} className="bg-slate-50 text-black hover:text-white">
                    ✕
                </Button>
            </div>

            <form onSubmit={handleSubmit} method="dialog">
                <div className="mb-4">
                    <Input type="hidden" name="id" value={data.id} />
                    <label className="mb-1 block text-sm font-medium text-gray-700">Schedule Name</label>
                    <Input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => {
                            setFormData((prev) => ({ ...prev, name: e.target.value }));
                            setData('name', e.target.value);
                        }}
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Select Route</label>
                    <select
                        value={getRouteDisplayValue()}
                        name="route"
                        onChange={(e) => handleRouteChange(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-gray-500 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value="" disabled className="hidden">
                            -- Select route --
                        </option>
                        <option value="Mabini to Tingloy">Mabini to Tingloy</option>
                        <option value="Tingloy to Mabini">Tingloy to Mabini</option>
                    </select>
                    {errors.start_location && <InputError message={errors.start_location} />}
                    {errors.end_location && <InputError message={errors.end_location} />}
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Date and Time</label>
                    <Input
                        type="datetime-local"
                        value={data.date_and_time}
                        onChange={(e) => {
                            setFormData((prev) => ({ ...prev, date_and_time: e.target.value }));
                            setData('date_and_time', e.target.value);
                        }}
                        required
                        name="date_and_time"
                    />
                    <InputError message={errors.date_and_time} />
                </div>

                {/* Hidden field to ensure route_id is submitted */}
                <input type="hidden" name="route_id" value={data.route_id} />

                <div className="mt-6 flex justify-end space-x-3">
                    <Button
                        onClick={closeEditRouteModal}
                        type="button"
                        className="border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                        tabIndex={5}
                        disabled={processing}
                    >
                        Cancel
                    </Button>

                    <Button type="submit" tabIndex={6} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {processing ? 'Updating...' : 'Update Route'}
                    </Button>
                </div>
            </form>
        </dialog>
    );
};

export default EditSchedule;
