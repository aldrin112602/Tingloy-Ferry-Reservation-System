<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class AccountsManagementController extends Controller
{
    public function index()
    {
        $accounts = User::latest()->paginate(5);
        return Inertia::render('features/admin/AccountsManagement', [
            'accounts' => $accounts,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role
        ]);

        return redirect()->route('admin.account.index')->with('success', 'Account created successfully');
    }

    public function put(Request $request, $id)
    {
        $account = User::findOrFail($id);

        if (!$account) {
            return redirect()->back()->with('error', 'User account not found');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($account->id),
            ],
            'password' => ['nullable', Rules\Password::defaults()],
        ]);

        // Prepare update data
        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $account->update($updateData);

        return redirect()->route('admin.account.index')->with('success', 'Account updated successfully');
    }

    public function destroy($id)
    {
        try {
            $account = User::findOrFail($id);

            // Prevent deletion of the currently authenticated user
            if (Auth::id() === $account->id) {
                return redirect()->back()->with('error', 'You cannot delete your own account');
            }

            // Optional: Prevent deletion of admin accounts (uncomment if needed)
            // if ($account->role === 'admin') {
            //     return redirect()->back()->with('error', 'Admin accounts cannot be deleted');
            // }

            $account->delete();

            return redirect()->route('admin.account.index')->with('success', 'Account deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete account. Please try again.');
        }
    }
}
