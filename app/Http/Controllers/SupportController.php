<?php

namespace App\Http\Controllers;

use App\Events\RecordChanged;
use App\Models\Support;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SupportController extends Controller
{
    public function index()
    {
        $supports = Support::with(['area', 'creator', 'client'])
            ->latest()
            ->paginate(10);

        return Inertia::render('supports/index', [
            'supports' => $supports,
        ]);
    }

    public function fetchPaginated()
    {
        return response()->json(
            Support::with(['area', 'creator', 'client'])
                ->latest()
                ->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $this->validateSupport($request);

        $support = new Support();
        $support->fill($request->except('attachment', 'created_by'));
        $support->created_by = Auth::id();

        if ($request->hasFile('attachment')) {
            $support->attachment = fileStore($request->file('attachment'), 'uploads');
        }

        $support->save();

        broadcast(new RecordChanged('Support', 'created', $support->toArray()))->toOthers();

        return response()->json([
            'message' => '✅ Ticket de soporte creado correctamente',
            'support' => $support,
        ]);
    }

    public function update(Request $request, $id)
    {
        $support = Support::findOrFail($id);
        $this->validateSupport($request);

        $support->fill($request->except('attachment'));

        if ($request->hasFile('attachment')) {
            $support->attachment = fileUpdate($request->file('attachment'), 'attachments', $support->attachment);
        }

        $support->save();

        broadcast(new RecordChanged('Support', 'updated', $support->toArray()))->toOthers();

        return response()->json([
            'message' => '✅ Ticket de soporte actualizado correctamente',
            'support' => $support,
        ]);
    }

    public function show($id)
    {
        $support = Support::with(['area', 'creator', 'client'])->findOrFail($id);
        return response()->json(['support' => $support]);
    }

    public function destroy($id)
    {
        $support = Support::findOrFail($id);
        $support->delete();

        broadcast(new RecordChanged('Support', 'deleted', ['id' => $support->id]))->toOthers();

        return response()->json(['success' => true]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Support::whereIn('id', $ids)->delete();

        foreach ($ids as $id) {
            broadcast(new RecordChanged('Support', 'deleted', ['id' => $id]))->toOthers();
        }

        return response()->json(['message' => 'Tickets eliminados correctamente']);
    }

    private function validateSupport(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Normal,Urgente,Preferencial',
            'type' => 'required|string|max:50',
            'attachment' => 'nullable|file|max:2048',
            'area_id' => 'nullable|exists:areas,id_area',
            'created_by' => 'required|exists:users,id',
            'client_id' => 'required|exists:clientes,id_cliente',
            'status' => 'required|in:Pendiente,Atendido,Cerrado',
            'reservation_time' => 'nullable|date',
            'attended_at' => 'nullable|date',
            'derived' => 'nullable|string|max:255',
            'cellphone' => 'nullable|string|max:20',
        ]);
    }
}
