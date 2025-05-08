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

// filter question by categories - qtypes
Route::get('/questions/qtype/{id}', [QuestionController::class, 'getQuestionsByQtype']);

// add new question
Route::post('/questions', [QuestionController::class, 'store']);

// update question
Route::put('/questions/{id}', [QuestionController::class, 'edit']);

// delete question
Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);

