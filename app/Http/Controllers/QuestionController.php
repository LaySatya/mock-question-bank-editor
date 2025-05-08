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
            $pagedData,
            'pages' => [
                'current_page' => $currentPage,
                'total_pages' => $totalPages,
                'total_items' => $totalItems,
                'per_page' => $perPage,
            ]
        ]);
    }

    // get questions by specific qtype
    public function getQuestionsByQtype(Request $request, $id){

        // get json data
        $json = Storage::disk('local')->get('questions.json');

        // convert json to php array
        $questions = json_decode($json, true);

        $questionsQtype = [];

        // loop and find all qtype which equel id
        foreach($questions as $question){
            if(isset($question['qtype']) && $question['qtype']['id'] == $id){
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

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Validate incoming data
    $validated = $request->validate([
        'name' => 'required|string',
        'questiontext' => 'required|string',
        'generalfeedback' => 'nullable|string',
        'qtype.id' => 'required|integer',
        'category.id' => 'required|integer',
        'answers' => 'required|array', // Ensure answers is an array
        'answers.*.answer' => 'required|string', // Each answer must be a string
        'answers.*.fraction' => 'required|numeric', // Each answer must have a fraction value
        'answers.*.feedback' => 'nullable|string', // Each answer can have optional feedback
    ]);

    // Read existing questions
    $json = Storage::disk('local')->get('questions.json');
    $questions = json_decode($json, true);

    // Generate a new ID
    $newId = collect($questions)->max('id') + 1;

    // Check if the category exists
    $category_name = '';
    foreach ($questions as $question) {
        if ($question['category']['id'] == $validated['category']['id']) {
            $category_name = $question['category']['name'];
            break;
        }
    }

    // If category is not found, return an error
    if (empty($category_name)) {
        return response()->json([
            'message' => 'Category not found!'
        ], 404);
    }

    // Check if the qtype exists
    $qtype_name = '';
    foreach ($questions as $question) {
        if ($question['qtype']['id'] == $validated['qtype']['id']) {
            $qtype_name = $question['qtype']['name'];
            break;
        }
    }

    // If qtype is not found, return an error
    if (empty($qtype_name)) {
        return response()->json([
            'message' => 'Qtype not found!'
        ], 404);
    }

    // Build the new question
    $newQuestion = [
        'id' => $newId,
        'name' => $validated['name'],
        'category' => [
            'id' => $validated['category']['id'],
            'name' => $category_name,
            'contextid' => 1,
        ],
        'parent' => 0,
        'questiontext' => $validated['questiontext'],
        'questiontextformat' => 1,
        'image' => '',
        'generalfeedback' => $validated['generalfeedback'] ?? '',
        'defaultgrade' => 1,
        'penalty' => 0.1,
        'qtype'  => [
            'id' => $validated['qtype']['id'],
            'name' => $qtype_name,
        ],
        'length' => 1,
        'stamp' => uniqid('stamp'),
        'version' => 1,
        'hidden' => 0,
        'timecreated' => time(),
        'timemodified' => time(),
        'createdby' => [
            'id' => 1,
            'fullname' => "admin",
        ],
        'modifiedby' => [
            'id' => 1,
            'fullname' => "admin",
        ],
        'answers' => $validated['answers'] // This is where the answers array is added
    ];

    // Add to questions array
    $questions[] = $newQuestion;

    // Save back to file
    Storage::disk('local')->put('questions.json', json_encode($questions, JSON_PRETTY_PRINT));

    return response()->json([
        'message' => 'Question created successfully',
        'question' => $newQuestion
    ], 201);
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
    public function edit(Request $request, $id)
    {
        // get json data
        $json = Storage::disk('local')->get('questions.json');

        // convert json to php array'
        $questions = json_decode($json, true);

        $updated = false;

        foreach($questions as &$question){
            if($question['id'] == $id){
                // Update fields from the request
                $question['name'] = $request->input('name', $question['name']);
                $question['questiontext'] = $request->input('questiontext', $question['questiontext']);
                $question['generalfeedback'] = $request->input('generalfeedback', $question['generalfeedback']);
                $question['timemodified'] = time();
                $question['version'] += 1;

                $updated = true;
                break; // stop after update
            }
            else{
                return response()->json([
                    'message' => 'Question not found!'
                ]);
            }
        }

        if ($updated) {
            // Save updated questions array back to the JSON file
            Storage::disk('local')->put('questions.json', json_encode($questions, JSON_PRETTY_PRINT));
            return response()->json(['message' => 'Question updated successfully']);
        } else {
            return response()->json(['message' => 'Question not found'], 404);
        }
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
