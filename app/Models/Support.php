<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Client;
use App\Models\Area;
use App\Models\User;
class Support extends Model
{
    use HasFactory;

    protected $table = 'supports';

    protected $fillable = [
        'subject',
        'description',
        'priority',
        'type',
        'attachment',
        'area_id',
        'created_by',
        'client_id',
        'status',
        'reservation_time',
        'attended_at',
        'derived',
        'cellphone',
    ];

    // Relaciones

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id', 'id_area');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'id_cliente');
    }
}
