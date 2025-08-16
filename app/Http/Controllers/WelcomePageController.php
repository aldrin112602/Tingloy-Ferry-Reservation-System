<?php
namespace App\Http\Controllers;
use App\Models\Route;
use Inertia\Inertia;

class WelcomePageController extends Controller
{
    public function index() {
        return Inertia::render('welcome');
    }

    public function about() {
        return Inertia::render('About');
    }

    public function routes() {
        $routes = Route::where('status', 'scheduled')->get();
        return Inertia::render('ScheduleAndRoutes', ['routes' => $routes]);
    }

    public function learnMore() {
        return Inertia::render('LearnMore');
    }


}
