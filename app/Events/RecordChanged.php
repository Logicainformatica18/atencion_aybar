<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class RecordChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $model;
    public string $action;
    public array $data;

    /**
     * Create a new event instance.
     */
    public function __construct(string $model, string $action, array $data)
    {
        $this->model = $model;
        $this->action = $action;
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): Channel
    {
        return new Channel('supports'); // canal público llamado "supports"
    }

    /**
     * Nombre del evento que será recibido en el frontend.
     */
    public function broadcastAs(): string
    {
        return 'record.changed';
    }
}
