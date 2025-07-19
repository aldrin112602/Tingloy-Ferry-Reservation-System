import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import type { AccountProps, AccountsManagementProps, AddAccountFormData } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import AddNewAccount from './components/AddNewAccount';
import EditAccount from './components/EditAccount';

const breadcrumbs = [
    {
        title: 'Accounts Management',
        href: '/admin/accounts_management',
    },
];


const AccountsManagement = ({ accounts, filterRole: initialFilterRole }: AccountsManagementProps) => {
    const [currentFilter, setCurrentFilter] = useState<'all' | 'admin' | 'staff' | 'passenger'>(initialFilterRole);

    const [deleteDialog, setDeleteDialog] = useState({
        isOpen: false,
        accountId: 0,
        accountName: '',
    });

    const { data, setData, post, processing, errors, reset } = useForm<Required<AddAccountFormData>>({
        role: '',
        name: '',
        email: '',
        password: '',
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editAccountObj, setEditAccountObj] = useState({
        id: 0,
        name: '',
        email: '',
        role: '',
        password: '',
        created_at: '',
        updated_at: '',
    });

    const openAddAccountModal = () => {
        setIsAddModalOpen(true);
    };

    const openEditAccountModal = (account: any) => {
        setEditAccountObj(account);
        setIsEditModalOpen(true);
    };

    const closeAddAccountModal = () => {
        setIsAddModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.account.store'), {
            onSuccess: () => {
                toast.success('Account added successfully.');
                closeAddAccountModal();
            },
            onError: (error) => {
                console.log('Error adding account:', error);
                toast.error('Failed to add account. Please try again.');
            },
        });
    };

    const handleDeleteAccount = (accountId: number, name: string) => {
        setDeleteDialog({
            isOpen: true,
            accountId,
            accountName: name,
        });
    };

    const confirmDeleteAccount = () => {
        router.delete(route('admin.account.destroy', deleteDialog.accountId), {
            onSuccess: () => {
                toast.success('Account deleted successfully.');
                setDeleteDialog({ isOpen: false, accountId: 0, accountName: '' });
                router.reload({ only: ['accounts'], data: { role: currentFilter } });
            },
            onError: (error) => {
                console.log('Error deleting account:', error);
                toast.error('Failed to delete account. Please try again.');
                setDeleteDialog({ isOpen: false, accountId: 0, accountName: '' });
            },
        });
    };

    const handleFilterChange = (role: 'all' | 'admin' | 'staff' | 'passenger') => {
        setCurrentFilter(role);
        router.get(route('admin.account.index'), { role: role }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePageChange = (url: string) => {
        if (url) {
            const urlObj = new URL(url);
            urlObj.searchParams.set('role', currentFilter);
            router.get(urlObj.toString(), {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string | number) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 dark:bg-gray-900 dark:text-gray-100">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold dark:text-gray-100">Accounts Management</h1>
                    <Button onClick={openAddAccountModal} className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">Add New Account</Button>
                </div>

                {/* Filter Buttons */}
                <div className="mb-4 flex space-x-2">
                    <Button
                        variant={currentFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('all')}
                        className={currentFilter === 'all' ? 'dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white' : 'dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}
                    >
                        All
                    </Button>
                    <Button
                        variant={currentFilter === 'admin' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('admin')}
                        className={currentFilter === 'admin' ? 'dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white' : 'dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}
                    >
                        Admin
                    </Button>
                    <Button
                        variant={currentFilter === 'staff' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('staff')}
                        className={currentFilter === 'staff' ? 'dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white' : 'dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}
                    >
                        Staff
                    </Button>
                    <Button
                        variant={currentFilter === 'passenger' ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('passenger')}
                        className={currentFilter === 'passenger' ? 'dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white' : 'dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'}
                    >
                        Passenger
                    </Button>
                </div>

                {/* Accounts List Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800 dark:shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">Created At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {accounts.data.length > 0 ? (
                                    accounts.data.map((account) => (
                                        <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">{account.name}</td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">{account.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-700 dark:text-blue-100">
                                                    {account.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">{formatDate(account.created_at)}</td>
                                            <td className="space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <Button variant="outline" size="sm" onClick={() => openEditAccountModal(account)}
                                                    className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                                                    Edit
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteAccount(account.id, account.name)}
                                                    className="dark:bg-red-700 dark:hover:bg-red-600 dark:text-white">
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No accounts found at the moment.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {accounts.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6
                                       dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(accounts.prev_page_url || '')}
                                    disabled={!accounts.prev_page_url}
                                    className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(accounts.next_page_url || '')}
                                    disabled={!accounts.next_page_url}
                                    className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    Next
                                </Button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing <span className="font-medium">{accounts.from}</span> to{' '}
                                        <span className="font-medium">{accounts.to}</span> of <span className="font-medium">{accounts.total}</span>{' '}
                                        results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                                        {accounts.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(link.url || '')}
                                                disabled={!link.url}
                                                className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${link.active
                                                    ? 'z-10 border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                                                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${index === 0 ? 'rounded-l-md' : ''
                                                    } ${index === accounts.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <AddNewAccount
                    isOpen={isAddModalOpen}
                    onOpenChange={setIsAddModalOpen}
                    closeAddRouteModal={closeAddAccountModal}
                    handleSubmit={handleSubmit}
                    data={data}
                    errors={errors}
                    setData={setData}
                    processing={processing}
                />

                <EditAccount isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} accountObj={editAccountObj} />
            </div>
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, isOpen: open })}>
                <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700">
                    <DialogTitle className="dark:text-gray-100">Confirm Deletion</DialogTitle>
                    <DialogDescription className="dark:text-gray-300">
                        Are you sure you want to delete <strong className="dark:text-gray-100">{deleteDialog.accountName}</strong>? This action cannot be undone and will permanently
                        remove the account and all associated data.
                    </DialogDescription>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 dark:border-t dark:border-gray-700 dark:pt-4">
                        <DialogClose asChild>
                            <Button variant="outline" className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={confirmDeleteAccount} className="dark:bg-red-700 dark:hover:bg-red-600 dark:text-white">
                            Delete Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default AccountsManagement;