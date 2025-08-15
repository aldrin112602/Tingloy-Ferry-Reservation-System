<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomePageController extends Controller
{
    public function index() {
        return Inertia::render('welcome');
    }

    public function about() {
        return Inertia::render('About');
    }

    public function contact() {

    }

    public function routes() {

    }

    public function schedule() {

    }


}
