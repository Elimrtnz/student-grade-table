<?php
//require db connect file
require("mysql_connect.php");

$output = [
	'success' => false,
	'data' => []
];
//grab student id from ajax post
$deleteId = $_POST['student_id'];

$query =  "DELETE FROM `student_data` WHERE `id` = '$deleteId'";
$result = mysqli_query($conn,$query);

if(empty($result)){
    $output['errors']='database error';
}
else{
    if(mysqli_affected_rows($conn)>0){
        $output['success'] = true;
        $output['data'] = mysqli_affected_rows($conn).' affected rows';
    }
    else{
        $output['errors']='delete error';
    }
}
$json_data = json_encode($output);
print_r($json_data);
?>