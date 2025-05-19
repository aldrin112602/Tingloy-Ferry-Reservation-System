import { FerrySchedulePaginatedResponse } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationLink = ({ paginatedResponseData }: { paginatedResponseData: FerrySchedulePaginatedResponse }) => {
    return (
        <>
            <div className="mt-8 flex items-center justify-center gap-1">
                {paginatedResponseData.links.map((link, i) => {
                    if ((link.label === '&laquo; Previous' || link.label === 'Next &raquo;') && link.url === null) {
                        return null;
                    }

                    if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                        return (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                    link.url === null ? 'cursor-not-allowed text-gray-300' : 'text-gray-700 hover:bg-gray-100'
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
                            className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                link.active
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
    );
};

export default PaginationLink;
