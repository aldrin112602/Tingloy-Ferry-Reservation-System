<?php

use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\StaffController;
use App\Models\Route as RouteSchedule;
use App\Http\Controllers\AdminBookingController;
use App\Http\Controllers\QrController;
use App\Http\Controllers\DashBoardController;
use App\Http\Controllers\AccountsManagementController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SetupFareTypeController;
use App\Http\Controllers\SetupPaymentController;
use App\Http\Controllers\WelcomePageController;
use App\Http\Controllers\ContactController;

Route::get('/', [WelcomePageController::class, 'index'])->name('home');
Route::get('/about', [WelcomePageController::class, 'about'])->name('about');
Route::post('/contact', [ContactController::class, 'submit'])->name('contact.submit');
Route::get('/learn_more', [WelcomePageController::class, 'learnMore'])->name('learn_more');
Route::get('/routes', [WelcomePageController::class, 'routes'])->name('routes');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashBoardController::class, 'index'])->name('dashboard');

    // STAFF ROUTES
    Route::prefix('staff')->middleware('role:staff')->group(function () {
        Route::get('notifications', [NotificationController::class, 'index'])->name('staff.notifications');
        Route::get('passengers', [StaffController::class, 'passengerList'])->name('staff.passengers');
        Route::get('scan_qr', [StaffController::class, 'scanQrCode'])->name('staff.scan_qr');
        Route::post('qr_validation', [QrController::class, 'validate'])->name('qr.validation');
        Route::post('booking/{id}', [QrController::class, 'bookingPaid'])->name('booking.paid');
    });

    // PASSENGER ROUTES
    Route::prefix('passenger')->middleware('role:passenger')->group(function () {
        Route::get('/api/setup_payments', [SetupPaymentController::class, 'getSetupPayments']);
        Route::get('/api/get_fare_types', [SetupFareTypeController::class, 'getFareTypes'])->name('passenger.setup_fare_types');
        
        Route::get('notifications', [NotificationController::class, 'index'])->name('passenger.notifications');

        Route::get('book_ticket', function () {
            $routes = RouteSchedule::where('status', 'scheduled')->latest()->get();
            return Inertia::render('features/passenger/BookTicket', ['routes' => $routes]);
        })->name('passenger.book_ticket');
        Route::get('bookings', [BookingController::class, 'index'])->name('passenger.bookings');
        Route::post('book', [BookingController::class, 'store'])->name('bookings.store');
        Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
    });

    // ADMIN ROUTES
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('setup_fare_types', [SetupFareTypeController::class, 'index'])->name('admin.setup_fare_types');
        Route::post('setup_fare_types', [SetupFareTypeController::class, 'store'])->name('admin.setup_fare_types.store');
        Route::put('setup_fare_types/{id}', [SetupFareTypeController::class, 'update'])->name('admin.setup_fare_types.update');
        Route::delete('setup_fare_types/{id}', [SetupFareTypeController::class, 'destroy'])->name('admin.setup_fare_types.destroy');

        
        Route::get('setup_payments', [SetupPaymentController::class, 'index'])->name('admin.setup_payments');
        Route::post('setup_payments', [SetupPaymentController::class, 'store'])->name('admin.setup_payments.store');
        Route::put('setup_payments/{id}', [SetupPaymentController::class, 'update'])->name('admin.setup_payments.update');
        Route::delete('setup_payments/{id}', [SetupPaymentController::class, 'destroy'])->name('admin.setup_payments.destroy');

        
        Route::get('notifications', [NotificationController::class, 'index'])->name('admin.notifications');
        Route::get('accounts_management', [AccountsManagementController::class, 'index'])->name('admin.account.index');
        Route::post('accounts_management', [AccountsManagementController::class, 'store'])->name('admin.account.store');
        Route::delete('accounts_management/{id}', [AccountsManagementController::class, 'destroy'])->name('admin.account.destroy');
        Route::put('accounts_management/{id}', [AccountsManagementController::class, 'put'])->name('admin.account.put');
        Route::get('schedule', [RouteController::class, 'index'])->name('admin.schedule.index');
        Route::post('schedule', [RouteController::class, 'store'])->name('admin.schedule.store');
        Route::put('schedule', [RouteController::class, 'put'])->name('admin.schedule.put');
        Route::delete('schedule/{id}', [RouteController::class, 'delete'])->name('admin.schedule.delete');


        Route::prefix('bookings')->group(function () {
            Route::get('/', [AdminBookingController::class, 'index'])->name('admin.bookings');
            Route::get('details/{id}', [AdminBookingController::class, 'show'])->name('admin.bookings.show');
            Route::post('approve/{id}', [AdminBookingController::class, 'approve'])->name('admin.bookings.approve');
            Route::post('reject/{id}', [AdminBookingController::class, 'reject'])->name('admin.bookings.reject');
        });
    });
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
