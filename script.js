$(document).ready(function(){
	$('#add').on('click', addClicked);
	$('#cancel').on('click', cancelClicked);
	$('#sort').on('click', sortList);
	resetStudentArray();
	getDataClicked();
	hardCodedStudent();
});

//temporary function for example student
function hardCodedStudent(){
	$('.editOperation').on('click', editStudent);
	$('.trash').on('click', deleteFromDom);
	$('.editBtn').tooltip();
	$('.trash').tooltip();
}

var student_array = []; // global student array to hold added student objects
var processRequest = false; //variable to confirm input checking
var inputIds = ['studentName','course','studentGrade'];

function addClicked(){
	validateInputs();
	addStudent();
}

function addStudent(){
	if(processRequest===true){
		var studentsObj = {
			name: '',
			course: '',
			grade:''
		}
		//grab values from Add Student form
	studentsObj.name = $('#studentName').val();
    studentsObj.course = $('#course').val();
    studentsObj.grade = $('#studentGrade').val();
    student_array.push(studentsObj);
    updateDataOnDom();
    clearAddStudentForm();
    //*************************************************************************************************************addStudentToDB(studentsObj);
	}
}

function updateDataOnDom(){
	$('.avgGrade').text(calculateAverageGrade());
	updateStudentList();
}

function updateStudentList(){
	$('tbody').empty(); // clear <tbody> to avoid dupicate data
	for(var x=0; x<student_array.length; x++){
		addStudentToDom(student_array[x]);
	}
}

function addStudentToDom(studentsObj){
	//create button operations with necessary attributes, classes, and functions
	var addEditBtn = $('<button>').addClass('btn btn-primary editBtn editOperation col-xs-5').attr({'type':'button', 'data-toggle':'tooltip', 'title':'Edit'}).append($('<span>').addClass('glyphicon glyphicon-pencil')).on('click', editStudent).tooltip();
	var addDeleteBtn = $('<button>').addClass('btn btn-danger trash col-xs-5').attr({'type':'button', 'data-toggle':'tooltip', 'title':'Delete'}).append($('<span>').addClass('glyphicon glyphicon-trash')).on('click', deleteFromDom).tooltip();
	//create spans with student object values 
	var addStudentName = $('<span>').text(studentsObj.name);
	var addStudentCourse = $('<span>').text(studentsObj.course);
	var addStudentGrade = $('<span>').text(studentsObj.grade);
	//create new student row table data
	var nameSection = $('<td>').addClass('studentName col-xs-3').append(addStudentName,$('<input>').addClass('editInput').attr('type','text'));
	var courseSection = $('<td>').addClass('studentCourse col-xs-3').append(addStudentCourse,$('<input>').addClass('editInput').attr('type','text'));
	var gradeSection = $('<td>').addClass('studentGrade col-xs-3').append(addStudentGrade,$('<input>').addClass('editInput').attr({'type':'number', 'max':'100', 'min':'0'}));
	var operationSection = $('<td>').addClass('studentOps col-xs-3').append(addEditBtn,addDeleteBtn);
	//create new student row 
	var newStudentRow = $('<tr>').append(nameSection,courseSection,gradeSection,operationSection).addClass('col-xl-12');
	//append new student row to <tbody>
	$('tbody').append(newStudentRow);
}

function editStudent(){	
	//if the pencil button is in edit mode 
	if($(this).hasClass('editBtn')){

		//grab the current text values of the student row being edited
		var namePlaceholder = $(this).parents('td').siblings('.studentName').find('span').text();
		var coursePlaceholder = $(this).parents('td').siblings('.studentCourse').find('span').text();
		var gradePlaceholder = $(this).parents('td').siblings('.studentGrade').find('span').text();

		//hide the corresponding spans and show their comparable input fields
		$(this).parents('td').siblings('td').find('span').hide();
		$(this).parents('td').siblings('td').find('.editInput').show();

		//insert the previous span values as placeholder text into the edit input fields
		$(this).parents('td').siblings('.studentName').find('input').val(namePlaceholder);
		$(this).parents('td').siblings('.studentCourse').find('input').val(coursePlaceholder);
		$(this).parents('td').siblings('.studentGrade').find('input').val(gradePlaceholder);

		//change the pencil button into a save button 
		$(this).removeClass('btn btn-primary editBtn');
		$(this).addClass('btn btn-success saveBtn').attr({'type':'button', 'data-toggle':'tooltip', 'data-original-title':'Save'}).tooltip();
		$(this).find('span').removeClass('glyphicon glyphicon-pencil').addClass('glyphicon glyphicon-ok');
	}
	//else the button is in save mode
	else if($(this).hasClass('saveBtn')){

			//grab the new values from the current input fields
			var newName = $(this).parents('td').siblings('.studentName').find('input').val();
			var newCourse = $(this).parents('td').siblings('.studentCourse').find('input').val();
			var newGrade = $(this).parents('td').siblings('.studentGrade').find('input').val();

			//insert the revised values into the corresponding spans
			$(this).parents('td').siblings('.studentName').find('span').text(newName);
			$(this).parents('td').siblings('.studentCourse').find('span').text(newCourse);
			$(this).parents('td').siblings('.studentGrade').find('span').text(newGrade);

			//show the new span values and hide the edit inputs
			$(this).parents('td').siblings('td').find('span').show();
			$(this).parents('td').siblings('td').find('.editInput').hide();

			//change the save button into an edit button
			$(this).removeClass('btn btn-success saveBtn');
			$(this).addClass('btn btn-primary editBtn').attr({'type':'button', 'data-toggle':'tooltip', 'data-original-title':'Edit'}).tooltip();
			$(this).find('span').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-pencil');

			//update the student object in student array after clicking save
			var editIndex = $(this).parent().parent().index(); //index of the current student row the save button is on

			//set saved student values into the global student array[object] according to their respective property names
			var editId = student_array[editIndex].id;
			student_array[editIndex].name = newName; 
			student_array[editIndex].course = newCourse;
			student_array[editIndex].grade = newGrade;

			var updateStudentObj={
				id:'',
				name: '',
				course: '',
				grade: ''
			}

			updateStudentObj.id = editId;
			updateStudentObj.name = newName;
    		updateStudentObj.course = newCourse;
    		updateStudentObj.grade = newGrade;

    		//*******************************************************************************************************************updateStudentOnDB(updateStudentObj);
		
			updateDataOnDom();
	}
}

function deleteFromDom(){
	//get the index of the current <tr> based on its position compared to sibling <tr>'s in the parent element <tbody>
	var rowIndex = $(this).parent().parent().index();
	var databaseId = student_array[rowIndex].id;
	//**************************************************************************************************************************deleteStudentFromDB(databaseId);
	student_array.splice(rowIndex,1);
	updateDataOnDom();
}

function calculateAverageGrade(){
    var average = 0;
    // add each student grade to number variable
    for(var x=0; x < student_array.length; x++){
        average += parseFloat(student_array[x].grade);
    }
    // divide total grade number by number of students in array
    average = (average/student_array.length).toFixed(2);
    if(isNaN(average)){
    	return 0;
    }
    else{
        return average;
    }
}

function clearAddStudentForm(){
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}

function cancelClicked(){
    clearAddStudentForm ();
}

function resetStudentArray(){
	student_array = [];
}

function validateInputs(){
	var blankFields = 0;
	//loop through input form values and check for input errors
	for(var i=0; i<inputIds.length;i++){
		//specific validation for grade input
		if(i===2){
			if(isNaN($('#'+inputIds[i]).val())||$('#'+inputIds[i]).val() < 0||$('#'+inputIds[i]).val() > 100||$('#'+inputIds[i]).val()===''){
				$('#'+inputIds[i]).parent().next('label').show();
				blankFields++;
			}
			else{
				$('#'+inputIds[i]).parent().next('label').hide();
			}
		}
		//validation for studentName/course
		else{
			if($('#'+inputIds[i]).val()===''){
				$('#'+inputIds[i]).parent().next('label').show();
				blankFields++;
			}
			else{
				$('#'+inputIds[i]).parent().next('label').hide();
			}
		}
	}
	//check to see if any input field are blank
	if(blankFields>0){
		processRequest = false;
	}
	else if(blankFields<=0){
		processRequest = true;
	}
}

//*********************** DATABASE CRUD OPERATIONS ****************

//read data from DB
function getDataClicked(){
    $.ajax( {
        url: 'getData.php',
        success: function(serverData){
            for(var i=0; i < serverData.data.length ; i++) {
                student_array.push(serverData.data[i]);
            }
           updateDataOnDom();
        },
        error: function (response) {
            //console.log(response);
        },
        dataType: 'json',
        method: 'post',
    });
}
//add student data to DB
function addStudentToDB(students_obj){
    var insert_data_object = {
        name: students_obj.name,
        course: students_obj.course,
        grade: students_obj.grade
    };

    $.ajax( {
        url: 'insert.php',
        data: insert_data_object,
        success: function(response){
            //console.log('success, you have sent data to the server!', response);
        },
        error: function (response) {
            //console.log(response);
        },
        dataType: 'html',
        method: 'post',
    });
}
//delete student data from DB
function deleteStudentFromDB(id){
    var delete_object = {
        student_id: id
    };

    $.ajax( {
        url: 'delete.php',
        data: delete_object,
        success: function(deleteResponse){
            //console.log('delete student is functional',deleteResponse);
        },
        error: function (response) {
            //console.log(response);
        },
        dataType: 'html',
        method: 'post',
    });
}
//update student data on database
function updateStudentOnDB(update_StudentObj){

    var update_data_object = {
    	updateId: update_StudentObj.id,
        updateName: update_StudentObj.name,
        updateCourse: update_StudentObj.course,
        updateGrade: update_StudentObj.grade
    };

    $.ajax( {
        url: 'update.php',
        data: update_data_object,
        success: function(response){
            //console.log('success, you have updated data on the database!', response);
        },
        error: function (response) {
            //console.log(response);
        },
        dataType: 'html',
        method: 'post',
    });
}
// sort query in database
function sortList(){
	//grab values from sort form
	var sortField = $('#orderBy').val();
	var sortType = $('#highLow').val();

	var filter_data_object = {
    	filterField: sortField,
        filterType: sortType,
    };

    $.ajax( {
        url: 'sort.php',
        data: filter_data_object,
        success: function(sortResponse){
            //console.log('success, you have filtered data on the database!', filterResponse);
            resetStudentArray();
            for(var i=0; i < sortResponse.data.length ; i++) {
                student_array.push(sortResponse.data[i]);
            }
           updateDataOnDom();
        },
        error: function (response) {
            //console.log(response);
        },
        dataType: 'json',
        method: 'post',
    });
}