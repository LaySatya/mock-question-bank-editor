<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function index()
     {
        // get json data
        $json = Storage::disk('local')->get('questions.json');

        // convert json to php array
        $questions = json_decode($json, true);
         return response()->json($questions);
     }

     public function getQuestionById(Request $request, $id){

           // get json data
          $json = Storage::disk('local')->get('questions.json');

          // convert json to php array
          $data = json_decode($json, true);

          // fiter question by id in json file
          $question = collect($data)->firstwhere('id', $id);

          // check if the question id exist
          if($question){
            return response()->json($question, 200);
          }
          else{
            return response()->json([
                'message' => 'Question not found!',
            ], 404);
          }
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
