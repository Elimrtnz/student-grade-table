<?php
//require db connect file
require("mysql_connect.php");

$output = [
	'success' => false,
	'data' => []
];

if($_POST){

    $name = $_POST['name'];
    $course = $_POST['course'];
    $grade = $_POST['grade'];

	$query = "INSERT INTO student_data(`name`, `grade`, `course`) VALUES('$name','$grade','$course')";
	$result = mysqli_query($conn,$query);

	if(mysqli_affected_rows($conn)>0){
        $output['success'] = true;
        $newRowId = mysqli_insert_id($conn);
        $output['insertID'] = $newRowId;
    }
    else{

        $output['errors']='insert error';
    }
}
$json_data = json_encode($output);
    print_r($json_data);
?>