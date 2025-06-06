<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel; // ✅ Canal público
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public string $message;

    public function __construct(string $message)
    {
        $this->message = $message;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('chat'); // ✅ público
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
