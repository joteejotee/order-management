<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pen extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'price',
    ];
    public function orders()
    {
        // PenモデルからOrderモデルへのリレーションを定義
        return $this->hasMany(Order::class);
    }
}
