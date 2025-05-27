import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { EditAccountFormData, EditAccountProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UpdatedEditAccountProps extends Omit<EditAccountProps, 'dialogRefEdit'> {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    accountObj: any;
}

const EditAccount: React.FC<UpdatedEditAccountProps> = ({ isOpen, onOpenChange, accountObj }) => {
    const [formData, setFormData] = useState<EditAccountFormData>({
        id: accountObj?.id || 0,
        name: accountObj?.name || '',
        email: accountObj?.email || '',
        role: accountObj?.role || '',
        password: '',
    });

    useEffect(() => {
        if (accountObj) {
            setFormData({
                id: accountObj?.id || 0,
                name: accountObj.name || '',
                email: accountObj.email || '',
                role: accountObj.role || '',
                password: '',
            });
        }
    }, [accountObj]);

    const { data, setData, put, processing, errors, reset } = useForm<EditAccountFormData>(formData);

    useEffect(() => {
        Object.entries(formData).forEach(([key, value]) => {
            setData(key as keyof EditAccountFormData, value);
        });
    }, [formData]);

    const closeEditAccountModal = () => {
        onOpenChange(false);
        reset();

        setFormData({
            id: 0,
            name: '',
            email: '',
            role: '',
            password: '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('admin.account.put', { id: data.id }), {
            onSuccess: (response) => {
                toast.success('Account updated successfully.');
                console.log('Account updated successfully:', response);
                closeEditAccountModal();
            },
            onError: (error) => {
                toast.error('Error updating account, Please try again.');
                console.error('Error updating account:', error);
            },
        });
    };

    const handleFieldChange = (field: keyof EditAccountFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setData(field, value);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Account</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input type="hidden" name="id" value={data.id} />

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                        <Input type="text" name="name" value={data.name} onChange={(e) => handleFieldChange('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                        <Input type="email" name="email" value={data.email} onChange={(e) => handleFieldChange('email', e.target.value)} required />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Select Role</label>
                        <select
                            value={data.role}
                            name="role"
                            onChange={(e) => handleFieldChange('role', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-gray-500 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="" disabled className="hidden">
                                -- Select role --
                            </option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="passenger">Passenger</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
                        <Input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => handleFieldChange('password', e.target.value)}
                            placeholder="Leave empty to keep current password"
                        />
                        <InputError message={errors.password} />
                        <p className="mt-1 text-xs text-gray-500">Leave empty to keep the current password</p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button onClick={closeEditAccountModal} type="button" variant="outline" disabled={processing}>
                            Cancel
                        </Button>

                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {processing ? 'Updating...' : 'Update Account'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditAccount;
