<?php

namespace App\Http\Controllers;

use App\Mail\EventCreatedEmail;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $this->customer($request);
        $query = $request->user()->events()->with('bookings.vendorProfile.category')->latest('date');
        if ($request->filled('status') && $request->input('status') !== 'All Events') {
            $query->where('status', $request->input('status'));
        }
        return response()->json(['events' => $query->get()->map(fn ($event) => $this->serialize($event))]);
    }

    public function store(Request $request)
    {
        $this->customer($request);
        $event = $request->user()->events()->create($request->validate($this->rules()) + ['status' => 'Planning']);
        // A mail outage must not report a failed insert after creation succeeded.
        try {
            Mail::to($request->user()->email)->queue(new EventCreatedEmail($request->user(), $event));
        } catch (\Throwable $exception) {
            report($exception);
        }
        return response()->json(['event' => $this->serialize($event)], 201);
    }

    public function show(Request $request, Event $event)
    {
        $this->owner($request, $event);
        return response()->json(['event' => $this->serialize($event)]);
    }

    public function update(Request $request, Event $event)
    {
        $this->owner($request, $event);
        $data = $request->validate($this->rules(true));
        $event = DB::transaction(function () use ($event, $data) {
            $event = Event::whereKey($event->id)->lockForUpdate()->firstOrFail();
            abort_if($event->completed_at || $event->status === 'Past', 422, 'Completed events cannot be edited.');
            if ($event->bookings()->exists()) {
                foreach (['date', 'category', 'guests', 'location'] as $field) {
                    $old = $field === 'date' ? $event->date->format('Y-m-d') : $event->$field;
                    abort_if(array_key_exists($field, $data) && (string) $data[$field] !== (string) $old,
                        422, 'Date, type, guests and location are locked after a booking request.');
                }
            }
            if (isset($data['date']) && $data['date'] !== $event->date->format('Y-m-d')) {
                abort_if($data['date'] < today()->format('Y-m-d'), 422, 'Choose today or a future date.');
            }
            $event->update($data);
            return $event;
        }, 3);
        return response()->json(['event' => $this->serialize($event)]);
    }

    public function destroy(Request $request, Event $event)
    {
        $this->owner($request, $event);
        DB::transaction(function () use ($event) {
            $event = Event::whereKey($event->id)->lockForUpdate()->firstOrFail();
            abort_if($event->bookings()->exists(), 422, 'An event with booking history cannot be deleted.');
            $event->delete();
        }, 3);
        return response()->json(['message' => 'Event deleted.']);
    }

    public function complete(Request $request, Event $event)
    {
        $this->owner($request, $event);
        $event = DB::transaction(function () use ($event) {
            $event = Event::whereKey($event->id)->lockForUpdate()->firstOrFail();
            if ($event->completed_at) return $event;
            abort_if($event->date->format('Y-m-d') >= today()->format('Y-m-d'), 422, 'Complete this event after its event date has passed.');
            $event->bookings()->where('status', 'accepted')->update([
                'status' => 'completed', 'active_date_key' => null, 'status_updated_at' => now(),
            ]);
            $event->bookings()->where('status', 'pending')->update(['status' => 'rejected', 'status_updated_at' => now()]);
            $event->update(['status' => 'Past', 'completed_at' => now()]);
            return $event;
        }, 3);
        return response()->json(['event' => $this->serialize($event)]);
    }

    private function rules(bool $partial = false): array
    {
        $prefix = $partial ? 'sometimes|' : '';
        return [
            'title' => $prefix.'required|string|max:255',
            'category' => $prefix.'required|string|max:100',
            'date' => $prefix.'required|date_format:Y-m-d'.($partial ? '' : '|after_or_equal:today'),
            'location' => $prefix.'required|string|max:255',
            'guests' => $prefix.'required|integer|min:1|max:1000000',
            'budget' => $prefix.'required|integer|min:0|max:999999999',
        ];
    }

    private function customer(Request $request): void
    {
        abort_unless($request->user()->role === 'customer', 403, 'Only customers can manage events.');
    }

    private function owner(Request $request, Event $event): void
    {
        $this->customer($request);
        abort_unless((int) $event->user_id === (int) $request->user()->id, 404, 'Event not found.');
    }

    private function serialize(Event $event): array
    {
        $event->loadMissing('bookings.vendorProfile.category');
        $winners = $event->bookings->whereIn('status', ['accepted', 'completed'])->pluck('event_category_id');
        $visible = $event->bookings->filter(fn ($booking) =>
            in_array($booking->status, ['accepted', 'completed'], true) ||
            !$winners->contains($booking->event_category_id));
        return [
            'id' => $event->id, 'title' => $event->title, 'category' => $event->category,
            'date' => $event->date->format('Y-m-d'), 'location' => $event->location,
            'guests' => $event->guests, 'budget' => $event->budget, 'status' => $event->status,
            'completed_at' => $event->completed_at?->toISOString(),
            'has_bookings' => $event->bookings->isNotEmpty(),
            'bookings' => $visible->values()->map(fn ($booking) => [
                'id' => $booking->id, 'vendor_id' => $booking->vendor_profile_id,
                'vendor_name' => $booking->vendorProfile?->business_name ?? 'Unavailable vendor',
                'category' => $booking->vendorProfile?->category?->name ?? 'Other',
                'status' => $booking->status, 'package_name' => $booking->package_name,
                'package_price' => $booking->package_price,
            ]),
        ];
    }
}
