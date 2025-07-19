import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddNewScheduleProps } from '@/types';
import { LoaderCircle } from 'lucide-react';

const AddNewSchedule: React.FC<AddNewScheduleProps> = ({ dialogRefStore, closeAddRouteModal, handleSubmit, data, errors, setData, processing }) => {
    return (
        <dialog
            ref={dialogRefStore}
            className="mx-auto my-auto w-full max-w-md overflow-y-hidden rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
        >
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Schedule</h2>
                <Button onClick={closeAddRouteModal} className="bg-slate-50 text-black hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                    ✕
                </Button>
            </div>

            <form onSubmit={handleSubmit} method="dialog">
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Schedule Name
                    </label>
                    <Input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="dark:bg-gray-900 dark:text-white"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Route
                    </label>
                    <select
                        value={data.route}
                        name="route"
                        onChange={(e) => setData('route', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-gray-500 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:text-white dark:border-gray-600"
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
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date and Time
                    </label>
                    <Input
                        type="datetime-local"
                        value={data.date_and_time}
                        onChange={(e) => setData('date_and_time', e.target.value)}
                        required
                        name="date_and_time"
                        className="dark:bg-gray-900 dark:text-white"
                    />
                    <InputError message={errors.date_and_time} />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <Button
                        onClick={closeAddRouteModal}
                        type="button"
                        className="border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
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
