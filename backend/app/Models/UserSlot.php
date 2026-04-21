<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSlot extends Model
{
    protected $fillable = [
        'user_id',
        'slot_id',
        'file_path',
        'file_name',
        'uploaded_at',
    ];

    protected function casts(): array
    {
        return [
            'uploaded_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function slot()
    {
        return $this->belongsTo(Slot::class);
    }
}
