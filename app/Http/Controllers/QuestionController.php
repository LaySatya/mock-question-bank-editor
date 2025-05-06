<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function index()
     {
         return response()->json([
             [
                 'id' => 1,
                 'name' => 'Capital of France',
                 'category' => [
                     'id' => 10,
                     'name' => 'Geography',
                     'contextid' => 3
                 ],
                 'parent' => 0,
                 'questiontext' => 'What is the capital of France?',
                 'questiontextformat' => 1,
                 'image' => '',
                 'generalfeedback' => 'Paris is the correct answer.',
                 'defaultgrade' => 1.0000000,
                 'penalty' => 0.3333333,
                 'qtype' => 'multichoice',
                 'length' => 1,
                 'stamp' => 'abc123stamp',
                 'version' => 'v1.0',
                 'hidden' => 0,
                 'timecreated' => 1715000000,
                 'timemodified' => 1715003000,
                 'createdby' => [
                     'id' => 5,
                     'fullname' => 'Admin User'
                 ],
                 'modifiedby' => [
                     'id' => 5,
                     'fullname' => 'Admin User'
                 ],
                 'answers' => [
                     [
                         'id' => 101,
                         'question' => 1,
                         'answer' => 'Paris',
                         'fraction' => 1.0000000,
                         'feedback' => 'Correct!'
                     ],
                     [
                         'id' => 102,
                         'question' => 1,
                         'answer' => 'Berlin',
                         'fraction' => 0.0000000,
                         'feedback' => 'Incorrect, this is the capital of Germany.'
                     ],
                     [
                         'id' => 103,
                         'question' => 1,
                         'answer' => 'Madrid',
                         'fraction' => 0.0000000,
                         'feedback' => 'Wrong country.'
                     ]
                 ]
             ],
             [
                 'id' => 2,
                 'name' => 'Basic Algebra',
                 'category' => [
                     'id' => 11,
                     'name' => 'Mathematics',
                     'contextid' => 3
                 ],
                 'parent' => 0,
                 'questiontext' => 'Solve: 2x + 3 = 7',
                 'questiontextformat' => 1,
                 'image' => '',
                 'generalfeedback' => 'Isolate x by subtracting 3 and dividing by 2.',
                 'defaultgrade' => 2.0000000,
                 'penalty' => 0.0000000,
                 'qtype' => 'shortanswer',
                 'length' => 1,
                 'stamp' => 'xyz456stamp',
                 'version' => 'v1.0',
                 'hidden' => 0,
                 'timecreated' => 1715001000,
                 'timemodified' => 1715004000,
                 'createdby' => [
                     'id' => 6,
                     'fullname' => 'Teacher Jane'
                 ],
                 'modifiedby' => [
                     'id' => 6,
                     'fullname' => 'Teacher Jane'
                 ],
                 'answers' => [
                     [
                         'id' => 201,
                         'question' => 2,
                         'answer' => '2',
                         'fraction' => 1.0000000,
                         'feedback' => 'Well done!'
                     ],
                     [
                         'id' => 202,
                         'question' => 2,
                         'answer' => '4',
                         'fraction' => 0.0000000,
                         'feedback' => 'Check your math.'
                     ]
                 ]
             ]
         ]);
     }





    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        //
    }
}
