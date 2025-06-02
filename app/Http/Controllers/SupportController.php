<?php

namespace App\Http\Controllers;

use App\Events\RecordChanged;
use App\Models\Support;
use App\Models\Motive;
use App\Models\AppointmentType;
use App\Models\WaitingDay;
use App\Models\InternalState;
use App\Models\ExternalState;
use App\Models\Type;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SupportController extends Controller
{
   public function index()
{
    $supports = Support::with([
        'area:id_area,descripcion',
        'creator:id,firstname,lastname,names',
        'client:id_cliente,Razon_Social',
        'motivoCita:id_motivos_cita,nombre_motivo',
        'tipoCita:id_tipo_cita,tipo',
        'diaEspera:id_dias_espera,dias',
        'internalState:id,description',
        'externalState:id,description',
        'supportType:id,description'
    ])->latest()->paginate(10);

    // Opciones para selects
    $motives = Motive::select('id_motivos_cita as id', 'nombre_motivo')->get();
    $appointmentTypes = AppointmentType::select('id_tipo_cita as id', 'tipo')->get();
    $waitingDays = WaitingDay::select('id_dias_espera as id', 'dias')->get();
    $internalStates = InternalState::select('id', 'description')->get();
    $externalStates = ExternalState::select('id', 'description')->get();
    $types = Type::select('id', 'description')->get();

    return Inertia::render('supports/index', [
        'supports' => $supports,
        'motives' => $motives,
        'appointmentTypes' => $appointmentTypes,
        'waitingDays' => $waitingDays,
        'internalStates' => $internalStates,
        'externalStates' => $externalStates,
        'types' => $types,
    ]);
}

public function fetchPaginated()
{
    $supports = Support::with([
        'area:id_area,descripcion',
        'creator:id,firstname,lastname,names',
        'client:id_cliente,Razon_Social',
        'motivoCita:id_motivos_cita,nombre_motivo',
        'tipoCita:id_tipo_cita,tipo',
        'diaEspera:id_dias_espera,dias',
        'internalState:id,description',
        'externalState:id,description',
        'supportType:id,description'
    ])->latest()->paginate(10);

    return response()->json([
        'supports' => $supports
    ]);
}



public function store(Request $request)
{
    // Crear instancia del soporte
    $support = new Support();

    // Asignación con valores por defecto
    $support->subject = $request->input('subject', 'Nuevo Ticket de Soporte');
    $support->description = $request->input('description', 'Descripción del ticket de soporte');
    $support->client_id = $request->input('client_id', 1); // Asignar un cliente por defecto
    $support->cellphone = $request->input('cellphone', '0000000000'); // Asignar un celular por defecto

    $support->priority = $request->input('priority', 'Normal');
    $support->type = $request->input('type', 'Consulta');
    $support->status = $request->input('status', 'Pendiente');
    $support->reservation_time = $request->input('reservation_time', now());
    $support->attended_at = $request->input('attended_at', now()->addHour());
    $support->created_by = Auth::id();
    $support->external_state_id = 1;
    $support->internal_state_id = 1;
    $support->type_id = 1;
    $support->area_id = 1;

    $support->derived = $request->input('derived', '');
    $support->id_motivos_cita = 28;

    // Log antes de guardar
    Log::info('📥 Datos recibidos para nuevo soporte:', [
        'request' => $request->all(),
        'campos_seteados' => $support->toArray(),
    ]);

    // Adjuntar archivo si existe
    if ($request->hasFile('attachment')) {
        $support->attachment = fileStore($request->file('attachment'), 'uploads');
    }

    // Guardar
    $support->save();

    // Broadcast (si aplica)
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
        $support = Support::with([
            'area',
            'creator',
            'client',
            'motivoCita',
            'tipoCita',
            'diaEspera',
            'internalState',
            'externalState',
            'supportType'
        ])->findOrFail($id);

        return response()->json(['support' => $support]);
    }

    public function destroy($id)
    {
        $support = Support::findOrFail($id);
        $support->delete();

        broadcast(new RecordChanged('Support', 'deleted', ['id' => $support->id]));

        return response()->json(['success' => true]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Support::whereIn('id', $ids)->delete();

        foreach ($ids as $id) {
            broadcast(new RecordChanged('Support', 'deleted', ['id' => $id]));
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
            'client_id' => 'required|exists:clientes,id_cliente',
            'status' => 'required|in:Pendiente,Atendido,Cerrado',
            'reservation_time' => 'nullable|date',
            'attended_at' => 'nullable|date',
            'derived' => 'nullable|string|max:255',
            'cellphone' => 'nullable|string|max:20',
            'id_motivos_cita' => 'nullable|exists:motivos_cita,id_motivos_cita',
            'id_tipo_cita' => 'nullable|exists:tipos_cita,id_tipo_cita',
            'id_dia_espera' => 'nullable|exists:dias_espera,id_dias_espera',
            'internal_state_id' => 'nullable|exists:internal_states,id',
            'external_state_id' => 'nullable|exists:external_states,id',
            'type_id' => 'nullable|exists:types,id',
        ]);
    }
}
