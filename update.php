<?php
//require db connect file

require("mysql_connect.php");

$output = [
    'success' => false,
    'data' => []
];

//grab updated student valuesfrom ajax post
$updateId = $_POST['updateId'];
$updateName = $_POST['updateName'];
$updateCourse = $_POST['updateCourse'];
$updateGrade = $_POST['updateGrade'];

$query =  "UPDATE `student_data` SET `name`= '$updateName',`course`= '$updateCourse',`grade`= '$updateGrade' WHERE `id` = '$updateId' ";
$result = mysqli_query($conn,$query);

if(empty($result)){
    $output['errors']='database error';
}
else{
    if(mysqli_affected_rows($conn)>0){
        $output['success'] = true;
        $output['data']=[];
    }
    else{
        $output['errors']='update error';
    }
}

$response = json_encode($output);
print_r($response);
?>