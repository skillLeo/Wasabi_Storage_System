<?php

namespace App\Support;

use Illuminate\Filesystem\Filesystem;

class WindowsSafeFilesystem extends Filesystem
{
    public function replace($path, $content, $mode = null)
    {
        $compiledPath = (string) config('view.compiled');

        if ($compiledPath === '' || ! str_starts_with(str_replace('\\', '/', $path), str_replace('\\', '/', $compiledPath))) {
            parent::replace($path, $content, $mode);

            return;
        }

        file_put_contents($path, $content, LOCK_EX);

        if (! is_null($mode)) {
            @chmod($path, $mode);
        }
    }
}
