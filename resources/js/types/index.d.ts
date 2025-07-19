import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role?: string;
    [key: string]: unknown;
}

export interface RouteProps {
    id: number;
    name: string;
    route_code: string;
    start_location: string;
    end_location: string;
    date_and_time: string;
    capacity: number;
    seats_occupied: number;
    status: string;
    [key: string]: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface FerrySchedulePaginatedResponse {
    current_page: number;
    data: RouteProps[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    passengers?: Passenger[];
}

export interface BookingProps {
    id: number;
    user_id: number;
    route_id: number;
    ticket_code: string;
    payment_method: string;
    receipt_image: file | null;
    total_fee: number;
    is_paid: boolean;
    number_of_passengers: number;
    status: string;
    passengers: Passenger[];
    route: RouteProps;
    cancellation_reason: string | null;
}

export interface BookingDetailsProps {
    booking: BookingProps;
}

export type MyBookingsProps = {
    bookings: BookingProps[];
    [key: string]: unknown | any;
};

export interface AddRouteFormData {
    name: string;
    route: string;
    date_and_time: string;
    [key: string]: string;
}

export interface AddAccountFormData {
    name: string;
    email: string;
    password: string;
    role: string;
    [key: string]: string;
}

export interface PaginatedAccountData {
    current_page: number;
    data: AccountProps[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface AddNewScheduleProps {
    dialogRefStore: React.RefObject<HTMLDialogElement | null>;
    closeAddRouteModal: () => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    data: { name: string; route: string; date_and_time: string };
    errors: { name?: string; route?: string; date_and_time?: string };
    setData: (field: string, value: string) => void;
    processing: boolean;
}

export interface AddNewAccountProps {
    dialogRefStore: React.RefObject<HTMLDialogElement | null>;
    closeAddRouteModal: () => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    data: { name: string; email: string; password: string; role: string };
    errors: { name?: string; email?: string; password?: string; role?: string };
    setData: (field: string, value: string) => void;
    processing: boolean;
}

export interface EditRouteFormData {
    id: number;
    name: string;
    start_location: string;
    end_location: string;
    date_and_time: string;
    status: 'scheduled' | 'departed' | 'in_transit' | 'arrived' | 'cancelled';
    [key: string]: string | number;
}

export interface EditAccountFormData {
    id: number;
    name: string;
    email: string;
    password: string;
    [key: string]: string | number;
}

export interface AccountProps {
    id: number;
    name: string;
    email: string;
    password: string;
    [key: string]: string | number;
}

export interface EditScheduleProps {
    dialogRefEdit: React.RefObject<HTMLDialogElement | null>;
    routeObj: any;
}

export interface EditAccountProps {
    dialogRefEdit: React.RefObject<HTMLDialogElement | null>;
    accountObj: EditAccountFormData;
}

export interface RouteItemProps {
    route: RouteProps;
    onDelete?: () => void;
    openEditDialog: (route: RouteProps) => void;
}

export interface Ferry {
    id: number;
    date_and_time: string;
    start_location: string;
    end_location: string;
    capacity: number;
    seats_occupied: number;
}

export interface Schedule {
    id: number;
    route: string;
    time: string;
    date: string;
    available: number;
}

export interface Passenger {
    id: number;
    full_name: string;
    age: string;
    address: string;
    contact_number: string;
    residency_status: string;
    is_main_passenger: boolean;
    passenger_fare_type: string;
    passenger_fare?: number;
    file?: file | string | null;
}

export interface ViewPassengersProps {
    isOpenDialog: boolean;
    setISOpenDialog: (value: boolean) => void;
    passengersArr: Passenger[];
}

export interface BookingRowProps {
    booking: BookingProps;
}

export interface ManageBookingsProps extends User {
    booking: BookingProps[];
}

export interface BookingTableProps {
    users: ManageBookingsProps[];
    expandedUser: number | null;
    toggleUserExpand: (userId: number) => void;
}

export interface EmptyStateProps {
    message: string;
}

export interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
}

export interface UserBookingsProps {
    bookings: BookingProps[];
}

export interface DashBoardProps {
    bookings?: BookingProps[];
    allBookings?: BookingProps[];
    nextTrip?: RouteProps;
    upcomingTrips?: RouteProps[];
    passengers?: Passenger[];
    boardedCount?: number;
    todaysTripCount?: number;
    qrScannedCountToday?: number;
}

export interface ManageBookingsProps extends User {
    booking: BookingProps[];
}

export interface UserRowProps {
    user: ManageBookingsProps;
    isExpanded: boolean;
    toggleExpand: () => void;
}

export interface DisplayBookingsProps {
    bookings: BookingProps[];
    toggleBooking: (id: number) => void;
    handleCancel: (id: number) => void;
    handleEdit: (id: number, e: React.MouseEvent) => void;
    getStatusColor: (status: string) => string;
    expandedBooking: number | null;
    handleDelete: (id: number, e: React.MouseEvent) => void;
    formatDate: (dateString: string | number | Date) => string;
}

export interface BookingCompleteDisplayProps {
    breadcrumbs: BreadcrumbItem[];
    additionalPassengers: Passenger[];
    bookingReference: string | null;
}

export interface PaymentSectionProps {
    paymentMethod: string;
    mainPassengerFare: string;
    setPaymentMethod: (value: string) => void;
    additionalPassengers: Passenger[];
    receiptImage: string | null;
    setReceiptImage: (image: string | null) => void;
    form: {
        setData: (key: string, value: any) => void;
    };
    handleReceiptUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FormDataProps {
    route_id: string;
    full_name: string;
    age: string;
    passenger_fare_type: string;
    contact_number: string;
    residency_status: string;
    address: string;
    additional_passengers: Passenger[];
    payment_method: string;
    receipt_image: File | null;
}

export interface MainPassengerInformationProps {
    form: {
        setData: (key: string, value: any) => void;
        data: FormDataProps;
    };
    errors: { [key: string]: boolean };
}

export interface PassengerFareTypeProps {
    form: {
        setData: (key: string, value: any) => void;
        data: FormDataProps;
    };
    errors: { [key: string]: boolean };
}

export interface TripSelectionProps {
    form: {
        setData: (key: string, value: any) => void;
        data: FormDataProps;
    };
    schedules: Schedule[];
    errors: { [key: string]: boolean };
}

export interface AdditionalPassengerProps {
    addPassenger: () => void;
    form: {
        setData: (key: string, value: any) => void;
        data: FormDataProps;
    };

    additionalPassengers: Passenger[];
    removePassenger: (id: number, index: number) => void;
    handlePassengerChange: (id: number, index: number, field: string, value: string) => void;
    errors: { [key: string]: boolean };
}

export interface BookingDetailsProps {
    booking: BookingProps;
}

export interface CardDisplayDataProps {
    paginatedResponseData: FerrySchedulePaginatedResponse;
    setPassengersArr: (passengers: Passenger[]) => void;
    setISOpenDialog: (isOpen: boolean) => void;
}

export interface Html5QrScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanFailure?: (error: string) => void;
}

export interface AccountsManagementProps {
    accounts: PaginatedAccountData;
    filterRole: 'all' | 'admin' | 'staff' | 'passenger';
}
