<?php

namespace App\Services;

use Aws\S3\S3Client;
use Aws\Exception\AwsException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class WasabiService
{
    private S3Client $client;
    private string $bucket;

    public function __construct()
    {
        $this->bucket = config('filesystems.wasabi.bucket');

        $this->client = new S3Client([
            'version' => 'latest',
            'region' => config('filesystems.wasabi.region'),
            'endpoint' => config('filesystems.wasabi.endpoint'),
            'use_path_style_endpoint' => true,
            'credentials' => [
                'key' => config('filesystems.wasabi.key'),
                'secret' => config('filesystems.wasabi.secret'),
            ],
            // Disable SSL verification for local dev (XAMPP has no CA bundle)
            'http' => [
                'verify' => false,
            ],
        ]);
    }

    public function upload(UploadedFile $file, string $folder = 'documents'): string
    {
        $extension = $file->getClientOriginalExtension();
        $key = $folder . '/' . Str::uuid() . '.' . $extension;

        $this->client->putObject([
            'Bucket' => $this->bucket,
            'Key' => $key,
            'Body' => fopen($file->getRealPath(), 'r'),
            'ContentType' => $file->getMimeType(),
        ]);

        return $key;
    }

    public function delete(string $key): void
    {
        try {
            $this->client->deleteObject([
                'Bucket' => $this->bucket,
                'Key' => $key,
            ]);
        } catch (AwsException) {
            // Silently ignore — file may already be gone
        }
    }

    public function presignedUrl(string $key, int $minutes = 20): string
    {
        $cmd = $this->client->getCommand('GetObject', [
            'Bucket' => $this->bucket,
            'Key' => $key,
        ]);

        $request = $this->client->createPresignedRequest($cmd, '+' . $minutes . ' minutes');

        return (string) $request->getUri();
    }
}
