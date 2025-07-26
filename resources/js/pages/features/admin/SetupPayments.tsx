import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { SetupPaymentsProps } from '@/types';

const breadcrumbs = [
    {
        title: 'SetupPayments',
        href: '/admin/setup_payments',
    },
];

const SetupPayments = ({ SetupPayments }: SetupPaymentsProps) => {
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/admin/setup_payments/${id}`);
                Swal.fire('Deleted!', 'Payment method has been deleted.', 'success');
                router.reload();
            } catch (error: any) {
                Swal.fire('Error', error?.response?.data?.message || 'An error occurred.', 'error');
            }
        }
    };


    const handleAdd = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Add Payment',
            html: `
                <input id="swal-method" class="swal2-input" placeholder="Payment Method">
                <input id="swal-name" class="swal2-input" placeholder="Account Name">
                <input id="swal-number" class="swal2-input" placeholder="Account Number">
                `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save',
            preConfirm: () => {
                const method = (document.getElementById('swal-method') as HTMLInputElement)?.value;
                const name = (document.getElementById('swal-name') as HTMLInputElement)?.value;
                const number = (document.getElementById('swal-number') as HTMLInputElement)?.value;

                if (!method || !name || !number) {
                    Swal.showValidationMessage('All fields are required');
                    return null;
                }

                return { payment_method_name: method, account_name: name, account_number: number };
            },
        });

        if (formValues) {
            try {
                await axios.post('/admin/setup_payments', formValues);
                Swal.fire('Success', 'Payment method added successfully.', 'success');
                router.reload();
            } catch (error: any) {
                Swal.fire('Error', error?.response?.data?.message || 'Failed to add payment method.', 'error');
            }
        }
    };

    const handleEdit = async (payment: SetupPaymentsProps['SetupPayments']['data'][0]) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Payment',
            html: `
                <input id="swal-method" class="swal2-input" placeholder="Payment Method" value="${payment.payment_method_name}">
                <input id="swal-name" class="swal2-input" placeholder="Account Name" value="${payment.account_name}">
                <input id="swal-number" class="swal2-input" placeholder="Account Number" value="${payment.account_number}">
                `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update',
            preConfirm: () => {
                const method = (document.getElementById('swal-method') as HTMLInputElement)?.value;
                const name = (document.getElementById('swal-name') as HTMLInputElement)?.value;
                const number = (document.getElementById('swal-number') as HTMLInputElement)?.value;

                if (!method || !name || !number) {
                    Swal.showValidationMessage('All fields are required');
                    return null;
                }

                return { payment_method_name: method, account_name: name, account_number: number };
            },
        });

        if (formValues) {
            try {
                await axios.put(`/admin/setup_payments/${payment.id}`, formValues);
                Swal.fire('Success', 'Payment method updated successfully.', 'success');
                router.reload();
            } catch (error: any) {
                Swal.fire('Error', error?.response?.data?.message || 'Failed to update payment method.', 'error');
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Setup Payments" />
            <main className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Setup Payments</h1>
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                    >
                        <Plus size={16} />
                        Add Payment
                    </button>

                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-md shadow">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                            <tr>
                                <th className="text-left px-4 py-2">#</th>
                                <th className="text-left px-4 py-2">Payment Method</th>
                                <th className="text-left px-4 py-2">Account Name</th>
                                <th className="text-left px-4 py-2">Account Number</th>
                                <th className="text-left px-4 py-2">Created At</th>
                                <th className="text-left px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SetupPayments.data.map((payment, index) => (
                                <tr
                                    key={payment.id}
                                    className={index % 2 === 0
                                        ? 'bg-white dark:bg-gray-800'
                                        : 'bg-gray-50 dark:bg-gray-700'
                                    }
                                >
                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{payment.id}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{payment.payment_method_name}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{payment.account_name}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{payment.account_number}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                        {format(parseISO(payment.created_at), 'yyyy-MM-dd hh:mm a')}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(payment)}
                                                className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <Pencil size={16} className="mr-1" />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(payment.id)}
                                                className="inline-flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <Trash2 size={16} className="mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {SetupPayments.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No setup payments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination tabs */}
                    <>
                        <div className="mt-8 flex items-center justify-center gap-1">
                            {SetupPayments.links.map((link, i) => {
                                if ((link.label === '&laquo; Previous' || link.label === 'Next &raquo;') && link.url === null) {
                                    return null;
                                }

                                if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                    return (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`flex h-8 w-8 items-center justify-center rounded-md ${link.url === null ? 'cursor-not-allowed text-gray-300' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {link.label === '&laquo; Previous' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </Link>
                                    );
                                }

                                return (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`flex h-8 w-8 items-center justify-center rounded-md ${link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url === null
                                                ? 'cursor-not-allowed bg-gray-100 text-gray-300'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </>
                </div>
            </main>
        </AppLayout>
    );
};

export default SetupPayments;
