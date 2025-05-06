<?php

use App\Http\Controllers\QuestionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('test', function(){
    return response()->json(
        'Testing route'
    );
});

// get all questions
Route::get('/questions', [QuestionController::class, 'index']);

// get quesition by id
Route::get('/question/{id}', [QuestionController::class, 'getQuestionById']);

// get questions pagination - set limit question per pages
Route::get('/pagination-questions', [QuestionController::class, 'getPaginatedQuestions']);


// delete question
Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);
