import AppLayout from '@/layouts/app-layout';
import { BookingProps, PaginationLink, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const breadcrumbs = [
  {
    title: 'Notifications',
    href: '/admin/notifications',
  },
];

interface NotificationItem {
  booking: BookingProps;
  sender: User;
  type: string;
  message: string;
  is_seen: boolean;
  created_at: string;
}

interface NotificationsProps {
  notifications: {
    data: NotificationItem[];
    links: PaginationLink[];
  };
}

const Notifications = ({ notifications }: NotificationsProps) => {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />
      <main className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <ul className="space-y-4">
          {notifications.data.map((notif, index) => (
            <li
              key={index}
              className={`p-4 rounded shadow border-l-4 ${notif.message.endsWith('rejected.') ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 dark:border-rose-400' : (notif.is_seen
                ? 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700'
                : 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400')
                }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {format(parseISO(notif.created_at), 'MMM dd, yyyy hh:mm a')}
                </span>
              </div>

              <p className="mt-1 text-gray-800 dark:text-gray-100 font-medium">
                {notif.message}
              </p>

              <p className="text-xs inline-block mt-2 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase tracking-wide font-semibold">
                Type: {notif.type}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400 my-3">
                Ticket Code: {notif.booking?.ticket_code} | From:{' '}
                <b>{notif.sender?.name}</b> | Email:{' '}
                <b>
                  <a
                    className="hover:underline text-blue-600 dark:text-blue-400"
                    href={`mailto:${notif.sender?.email}`}
                  >
                    {notif.sender?.email}
                  </a>
                </b>
              </p>
            </li>
          ))}
        </ul>
        {notifications.data.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
            No notifications found.
          </p>
        )}

        {/* Pagination tabs */}
        <>
          <div className="mt-8 flex items-center justify-center gap-1">
            {notifications.links.map((link, i) => {
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
      </main>
    </AppLayout>
  );
};

export default Notifications;
