<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

class EncryptCookies extends Middleware
{
    /**
     * Indicates if cookies should be serialized.
     *
     * @var bool
     */
    protected static $serialize = false;

    /**
     * Indicates if cookies should be secure.
     *
     * @var bool
     */
    protected static $forceSecure = true;

    protected $except = [
        //
    ];
}
