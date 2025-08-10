<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (in_array($user->role, ['admin', 'staff'])) {
            $notifications = Notification::where('receiver_id', null)->orWhere('sender_id', null)
                ->with('booking', 'sender')
                ->latest()
                ->paginate(10);
        } else {
            $notifications = Notification::where('receiver_id', $user->id)
                ->with('booking', 'sender')
                ->latest()
                ->paginate(10);
        }



        switch ($user->role) {
            case 'admin':
                return Inertia::render('features/admin/Notifications', [
                    'notifications' => $notifications
                ]);
                break;
            case 'staff':
                return Inertia::render('features/staff/Notifications', [
                    'notifications' => $notifications
                ]);
                break;
            default:
                return Inertia::render('features/passenger/Notifications', [
                    'notifications' => $notifications
                ]);
                break;
        }
    }

    public function markAsSeen(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);
        $notification->is_seen = true;
        $notification->save();

        return redirect()->back()->with('success', 'Notification marked as seen.');
    }
}
