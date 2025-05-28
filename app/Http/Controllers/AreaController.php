<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Area ; // Asegúrate de importar el modelo Area
class AreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function searchByName(Request $request)
{
    $q = $request->input('q');

    $areas = Area::where('descripcion', 'like', "%$q%")
        ->where('habilitado', true)
        ->limit(10)
        ->get([
            'id_area as id',
            'descripcion as name',
        ]);

    return response()->json($areas);
}
public function getAllEnabled()
{
   $areas = Area::whereNotIn('descripcion', [
    'Cobranza',
    'BackOffice',
    'SuperAdmin',
])->get(['id_area as id', 'descripcion as name']);

    return response()->json($areas);
}

}
