import { EmptyStateProps } from '@/types';
import React from 'react';

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
    return (
        <div className="flex h-40 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-gray-500 dark:text-gray-300">{message}</p>
        </div>
    );
};

export default EmptyState;
