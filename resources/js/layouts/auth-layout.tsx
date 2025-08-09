import { Icon } from '@/components/icon';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { ArrowLeftIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            <>
                <Link href={route('home')} className='flex items-center gap-2'>
                    <Icon iconNode={ArrowLeftIcon}></Icon> Back
                </Link>
                {children}
            </>
        </AuthLayoutTemplate>
    );
}
