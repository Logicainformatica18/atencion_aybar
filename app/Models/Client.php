<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'clientes';
    protected $primaryKey = 'id_cliente';
    public $timestamps = false; // 👈 Esto desactiva created_at y updated_at

    protected $fillable = [
        'id_slin',
        'Codigo',
        'Razon_Social',
        'T.Doc.',
        'DNI',
        'NIT',
        'Direccion',
        'Ubigeo',
        'Departamento',
        'Provincia',
        'Distrito',
        'Telefono',
        'Email',
        'clave',
        'c_clave',
        'ref_telefono1',
        'ref_telefono2',
        'comentario',
        'canal',
        'habilitado',
        'id_rol'
    ];
}
