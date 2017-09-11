<?php
//require db connect file
require('mysql_connect.php');
// create response object
$output = [
    'success'=> false,
    'errors'=>[]
];

$query = "SELECT * FROM `student_data`";
$result = mysqli_query($conn,$query);

if(empty($result)){
    $output['errors']='database error';
}
else{
    $output['data']=[];
    if(mysqli_num_rows($result)>0){
        $output['success']= true;
        while($row = mysqli_fetch_assoc($result)){
            $output['data'][]= $row;
        }
    }
    else{
        $output['errors']='no data';
    }
}
$response = json_encode($output);
print_r($response);
?>