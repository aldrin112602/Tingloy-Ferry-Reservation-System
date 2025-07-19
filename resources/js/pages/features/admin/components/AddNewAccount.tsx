import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { type AddNewAccountProps } from '@/types';
import { LoaderCircle } from 'lucide-react';

interface UpdatedAddNewAccountProps extends Omit<AddNewAccountProps, 'dialogRefStore'> {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    closeAddRouteModal: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    data: any;
    errors: any;
    setData: (field: string, value: string) => void;
    processing: boolean;
}

const AddNewAccount: React.FC<UpdatedAddNewAccountProps> = ({
    isOpen,
    onOpenChange,
    closeAddRouteModal,
    handleSubmit,
    data,
    errors,
    setData,
    processing,
}) => {
    const handleClose = () => {
        closeAddRouteModal();
        onOpenChange(false);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(e);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Account</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                        <Input type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                        <Input type="email" name="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Select Role</label>
                        <select
                            value={data.role}
                            name="role"
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none text-gray-900 focus:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:border-gray-600 dark:focus:border-gray-400"
                            required
                        >
                            <option value="" disabled className="hidden">
                                -- Select role --
                            </option>
                            <option value="admin" className='dark:bg-gray-900'>Admin</option>
                            <option value="staff" className='dark:bg-gray-900'>Staff</option>
                            <option value="passenger" className='dark:bg-gray-900'>Passenger</option>
                        </select>

                        <InputError message={errors.role} />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Create Password</label>
                        <Input type="password" name="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button onClick={handleClose} type="button" variant="outline" disabled={processing}>
                            Cancel
                        </Button>

                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {processing ? 'Adding...' : 'Add Account'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewAccount;
