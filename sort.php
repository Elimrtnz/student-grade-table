<?php
//require db connect file
require('mysql_connect.php');
$output = [
    'success'=> false,
    'errors'=>[]
];

//grab sort requirements from ajax post variable
$sortField = $_POST['filterField'];
$sortType = $_POST['filterType'];

$query = "SELECT * FROM `student_data` ORDER BY `$sortField` $sortType";
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