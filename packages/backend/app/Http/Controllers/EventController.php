<?php

namespace App\Http\Controllers;

use App\Mail\EventCreatedEmail;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    /**
     * List the authenticated user's events, optionally filtered by status.
     */
    public function index(Request $request)
    {
        $query = $request->user()->events()->latest('date');

        if ($request->filled('status') && $request->string('status') !== 'All Events') {
            $query->where('status', $request->string('status'));
        }

        return response()->json([
            'events' => $query->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'status' => ['sometimes', Rule::in(['Planning', 'Confirmed', 'Past'])],
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'guests' => 'required|integer|min:0',
            'budget' => 'required|integer|min:0',
            'image' => 'nullable|string|max:2048',
        ]);

        $event = $request->user()->events()->create($validated);

        Mail::to($request->user()->email)->queue(new EventCreatedEmail($request->user(), $event));

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event,
        ], 201);
    }

    public function show(Request $request, Event $event)
    {
        $this->authorizeOwnership($request, $event);

        return response()->json(['event' => $event]);
    }

    public function update(Request $request, Event $event)
    {
        $this->authorizeOwnership($request, $event);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:100',
            'status' => ['sometimes', Rule::in(['Planning', 'Confirmed', 'Past'])],
            'date' => 'sometimes|required|date',
            'location' => 'sometimes|required|string|max:255',
            'guests' => 'sometimes|required|integer|min:0',
            'budget' => 'sometimes|required|integer|min:0',
            'image' => 'nullable|string|max:2048',
        ]);

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event,
        ]);
    }

    public function destroy(Request $request, Event $event)
    {
        $this->authorizeOwnership($request, $event);

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully',
        ]);
    }

    private function authorizeOwnership(Request $request, Event $event): void
    {
        abort_if($event->user_id !== $request->user()->id, 403, 'You do not own this event.');
    }
}
