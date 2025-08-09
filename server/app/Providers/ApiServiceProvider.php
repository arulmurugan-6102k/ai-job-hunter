<?php

namespace App\Providers;

use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ApiServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Global API error handling
        $this->app['api.exception.handler'] = function($request, $exception) {
            if($request->is('api/*')){
                return $this->handleApiException($request, $exception);
            }
            return null;
        };
    }

    public function handleApiException(Request $request, \Throwable $exception): JsonResponse
    {
        if($exception instanceof ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found',
                'error' => 'The requested resource does not exist'
            ], 404);
        }

        if($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => "Validation failed",
                'error' => $exception->errors()
            ], 422);
        }

        if($exception instanceof NotFoundHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'Endpoint not found',
                'error' => 'The requested API endpoint does not exist'
            ], 404);
        }

        return response()->json([
            'success' => false,
            'message' => 'Internal server error',
            'error' => config('app.debug') ? $exception->getMessage() : 'Something went wrong'
        ], 500);

    }
}
