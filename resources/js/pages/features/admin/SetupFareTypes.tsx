import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FareTypesProps, FareType } from '@/types';

const breadcrumbs = [
    {
        title: 'Fare Types',
        href: '/admin/setup_fare_types',
    },
];

const SetupFareTypes = ({ fareTypes }: FareTypesProps) => {

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
                await axios.delete(`/admin/setup_fare_types/${id}`);
                Swal.fire('Deleted!', 'Fare type has been deleted.', 'success');
                router.reload();
            } catch (error: any) {
                Swal.fire('Error', error?.response?.data?.message || 'An error occurred.', 'error');
            }
        }
    };

    const handleAdd = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Add Fare Type',
            html: `
            <input id="swal-name" class="swal2-input" placeholder="Fare Type Name">
            <input id="swal-price" class="swal2-input" placeholder="Price" type="number">
            <div style="text-align: center; margin-top: 1em;">
                <label style="display: block; margin-bottom: 0.5em;">Required Valid ID:</label>
                <input type="radio" id="swal-required-valid-id-yes" name="required_valid_id" value="1" checked>
                <label for="swal-required-valid-id-yes" style="margin-right: 1em;">Yes</label>
                <input type="radio" id="swal-required-valid-id-no" name="required_valid_id" value="0">
                <label for="swal-required-valid-id-no">No</label>
            </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save',
            preConfirm: () => {
                const name = (document.getElementById('swal-name') as HTMLInputElement)?.value;
                const price = (document.getElementById('swal-price') as HTMLInputElement)?.value;
                const requiredValidId = (document.querySelector('input[name="required_valid_id"]:checked') as HTMLInputElement)?.value;

                if (!name || !price) {
                    Swal.showValidationMessage('Fare type name and price are required');
                    return null;
                }

                // Check if price is a valid number
                if (isNaN(parseFloat(price))) {
                    Swal.showValidationMessage('Price must be a valid number');
                    return null;
                }

                return {
                    name,
                    price: parseFloat(price),
                    required_valid_id: requiredValidId === '1',
                };
            },
        });

        if (formValues) {
            try {
                await axios.post('/admin/setup_fare_types', formValues);
                Swal.fire('Success', 'Fare type added successfully.', 'success');
                router.reload();
            } catch (error: any) {
                Swal.fire('Error', error?.response?.data?.message || 'Failed to add fare type.', 'error');
            }
        }
    };

    const handleEdit = async (fareType: FareType) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Fare Type',
            html: `
            <input id="swal-name" class="swal2-input" placeholder="Fare Type Name" value="${fareType.name}">
            <input id="swal-price" type="number" class="swal2-input" placeholder="Price" value="${fareType.price}">
            <div style="text-align: center; margin-top: 1em;">
                <label style="display: block; margin-bottom: 0.5em;">Required Valid ID:</label>
                <input type="radio" id="swal-required-valid-id-yes" name="required_valid_id" value="1" ${fareType.required_valid_id ? 'checked' : ''}>
                <label for="swal-required-valid-id-yes" style="margin-right: 1em;">Yes</label>
                <input type="radio" id="swal-required-valid-id-no" name="required_valid_id" value="0" ${!fareType.required_valid_id ? 'checked' : ''}>
                <label for="swal-required-valid-id-no">No</label>
            </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update',
            preConfirm: () => {
                const name = (document.getElementById('swal-name') as HTMLInputElement)?.value;
                const price = (document.getElementById('swal-price') as HTMLInputElement)?.value;
                const requiredValidId = (document.querySelector('input[name="required_valid_id"]:checked') as HTMLInputElement)?.value;

                if (!name || !price) {
                    Swal.showValidationMessage('Fare type name and price are required');
                    return null;
                }

                return {
                    name,
                    price: parseFloat(price),
                    required_valid_id: requiredValidId === '1',
                };
            },
        });

        if (formValues) {
            try {
                await axios.put(`/admin/setup_fare_types/${fareType.id}`, formValues);
                Swal.fire('Success', 'Fare type updated successfully.', 'success');
                router.reload();
            } catch (error: any) {
                Swal.fire('Error', error?.response?.data?.message || 'Failed to update fare type.', 'error');
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fare Types" />
            <main className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Fare Types</h1>
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                    >
                        <Plus size={16} />
                        Add Fare Type
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 rounded-md shadow">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                            <tr>
                                <th className="text-left px-4 py-2">#</th>
                                <th className="text-left px-4 py-2">Fare Type</th>
                                <th className="text-left px-4 py-2">Required Valid ID</th>
                                <th className="text-left px-4 py-2">Price</th>
                                <th className="text-left px-4 py-2">Created At</th>
                                <th className="text-left px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fareTypes.data.map((fareType, index) => (
                                <tr
                                    key={fareType.id}
                                    className={index % 2 === 0
                                        ? 'bg-white dark:bg-gray-800'
                                        : 'bg-gray-50 dark:bg-gray-700'
                                    }
                                >
                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{fareType.id}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{fareType.name}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{fareType.required_valid_id ? 'True' : 'False'}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{`PHP ${fareType.price.toFixed(2)}`}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                        {format(parseISO(fareType.created_at), 'yyyy-MM-dd hh:mm a')}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(fareType)}
                                                className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <Pencil size={16} className="mr-1" />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(fareType.id)}
                                                className="inline-flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <Trash2 size={16} className="mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {fareTypes.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No fare types found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <>
                        <div className="mt-8 flex items-center justify-center gap-1">
                            {fareTypes.links.map((link, i) => {
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

export default SetupFareTypes;