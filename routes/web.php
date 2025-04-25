<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RouteController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::prefix('passenger')->group(function () {
        Route::get('book_ticket', function () {
            return Inertia::render('features/passenger/BookTicket');
        })->name('passenger.book_ticket');

        Route::get('routes', [RouteController::class, 'index'])->name('passenger.routes');

    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
