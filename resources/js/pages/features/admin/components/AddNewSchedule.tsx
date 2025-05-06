import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';

interface AddNewScheduleProps {
    dialogRefStore: React.RefObject<HTMLDialogElement | null>;
    closeAddRouteModal: () => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    data: { name: string; route: string; date_and_time: string };
    errors: { name?: string; route?: string; date_and_time?: string };
    setData: (field: string, value: string) => void;
    processing: boolean;
}

const AddNewSchedule: React.FC<AddNewScheduleProps> = ({ dialogRefStore, closeAddRouteModal, handleSubmit, data, errors, setData, processing }) => {
    return (
        <dialog ref={dialogRefStore} className="mx-auto my-auto w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add New Schedule</h2>
                <Button onClick={closeAddRouteModal} className="bg-slate-50 text-black hover:text-white">
                    ✕
                </Button>
            </div>

            <form onSubmit={handleSubmit} method="dialog">
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Shedule Name</label>
                    <Input type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                    <InputError message={errors.name} />
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Select Route</label>
                    <select
                        value={data.route}
                        name="route"
                        onChange={(e) => setData('route', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-gray-500 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value={''} disabled className="hidden">
                            -- Select route --
                        </option>
                        <option value="Mabini to Tingloy">Mabini to Tingloy</option>
                        <option value="Tingloy to Mabini">Tingloy to Mabini</option>
                    </select>

                    <InputError message={errors.route} />
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Date and Time</label>
                    <Input
                        type="datetime-local"
                        value={data.date_and_time}
                        onChange={(e) => setData('date_and_time', e.target.value)}
                        required
                        name="date_and_time"
                    />
                    <InputError message={errors.date_and_time} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button
                        onClick={closeAddRouteModal}
                        type="button"
                        className="border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                        tabIndex={5}
                        disabled={processing}
                    >
                        Cancel
                    </Button>

                    <Button type="submit" tabIndex={6} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {processing ? 'Adding...' : 'Add Route'}
                    </Button>
                </div>
            </form>
        </dialog>
    );
};

export default AddNewSchedule;
