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
        $questionJson = Storage::disk('local')->get('questions.json');

        // convert json to php array
        $questions = json_decode($questionJson, true);

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

    // get quesitons pagination - set limit question per page
    public function getPaginatedQuestions(Request $request)
    {
        // get json data
        $json = Storage::disk('local')->get('questions.json');

        // convert json to php array
        $data = json_decode($json, true);

        // items per page
        $perPage = 5;

        // get the current page from the request (default to page 1)
        $currentPage = $request->input('page', 1);

        // Calculate the offset (starting index for the page)
        $offset = ($currentPage - 1) * $perPage;

        // Slice the data to get the items for the current page
        $pagedData = array_slice($data, $offset, $perPage);

        // count data in array to get total question
        $totalItems = count($data);

        // total question / questionPerPage to get total pages
        $totalPages = ceil($totalItems / $perPage);

        // Return the paginated response
        return response()->json([
            'data' => $pagedData,
            'meta' => [
                'current_page' => $currentPage,
                'total_pages' => $totalPages,
                'total_items' => $totalItems,
                'per_page' => $perPage,
            ]
        ]);
    }

    public function getQuestionsByQtype(Request $request, $id){

        // get json data
        $json = Storage::disk('local')->get('questions.json');

        // convert json to php array
        $questions = json_decode($json, true);

        $questionsQtype = [];

        // loop and find all qtype which equel id
        foreach($questions as $question){
            if(isset($question['qtype_id']) && $question['qtype_id'] == $id){
                $questionsQtype[] = $question;
            }
        }

        // check qtype exist or not
        if(!empty($questionsQtype)){
            return response()->json($questionsQtype, 200);
        }
        else{
            return response()->json([
                'message' => 'No questions found for this qtype!'
            ], 401);
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
    public function destroy(Request $request, $id)
    {
        // get json data
        $json = Storage::disk('local')->get('questions.json');

        // convert json data to php array
        $data = json_decode($json, true);

        // check question id exist or not
        $question = collect($data)->firstwhere('id', $id);
        if(!$question){
            return response()->json([
                'message' => 'Question not found!',
            ], 404);
        }

        // filter all questions exept the question id which wanna delete
        $filterItems = [];
        foreach($data as $item){
            if($item['id'] != $id){
                $filterItems[] = $item;
            }
        }

        // array value funnction to ensure the array is sequential - [learn more about this]
        // array_values

        // convert from php to json
        $filteredJson = json_encode($filterItems, JSON_PRETTY_PRINT);

        // Store it back to the JSON file
        Storage::disk('local')->put('questions.json', $filteredJson);

        return response()->json([
            'message' => 'Question has been deleted successfully.',
            $filteredJson
        ]);
    }
}
