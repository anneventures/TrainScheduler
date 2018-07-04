  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBjKwLYqbURmFwd4WPNmvp7guWspZQrYnQ",
    authDomain: "train-scheduler-1c532.firebaseapp.com", //projectId.firebaseapp.com
    databaseURL: "https://train-scheduler-1c532.firebaseio.com", //databaseName.firebaseio.com
    projectId: "train-scheduler-1c532",
    storageBucket: "train-scheduler-1c532.appspot.com", //bucket.appspot.com
    messagingSenderId: "347956733836"
  };
  
  firebase.initializeApp(config);

//Get a reference to the database service
var database = firebase.database();

$("#currentTime").text(moment().format('HH:mm'));

//Clear button for Add Train form fields
$("#clear-train-btn").on("click", function(event) {
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
});  

//Add button for submitting new train data
$("#add-train-btn").on("click", function(event) {

  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = $("#first-train-time").val().trim();
  var frequency = $("#frequency").val().trim();

  // Add validation code using if and else if

  if (trainName === "" || destination === "" || firstTrainTime === "" || frequency ==="") {
    $("#feedback").html("<p>Please enter values in all form fields</p>");
    
    return false;

  } else if (firstTrainTime.length !== 5 || firstTrainTime.substring(2,3)!== ":") {
    $("#feedback").html("<p>Please enter the First Train Time in military time format</p>");

    return false;

  } else {

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainTimeBefore = moment(firstTrainTime, "HH:mm").subtract(1, "years");    

    // Current Time
    var currentTime = moment().format("HH:mm");
      
    // Difference between the times
    var timeDiff = moment().diff(moment(firstTrainTimeBefore), "minutes");

    // Time apart (remainder)
    var remainder = timeDiff % frequency;

    // Minute Until Train
    var minsAway = frequency - remainder;

    // Next Train
    var nextTrain = moment().add(minsAway, "minutes").format("HH:mm");

    // Creates local "temporary" object for holding train data
    var newTrain = {
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      nextTrain: nextTrain,
      minsAway: minsAway,
      currentTime: currentTime
    };

    // Uploads train data to the database
    database.ref("trainData").push(newTrain);

    alert("New train successfully added");
    location.reload();

    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
  }

});

//Create Firebase event for adding train to the database and a row in the html when a user adds an entry 
database.ref("trainData").on("child_added", function(childSnapshot) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;
  var nextTrain = childSnapshot.val().nextTrain;
  var minsAway = childSnapshot.val().minsAway;

  var trainDataChild = childSnapshot.key;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainTimeBefore = moment(firstTrainTime, "HH:mm").subtract(1, "years");    

  // Current Time
  var currentTime = moment().format("HH:mm");
    
  // Difference between the times
  var timeDiff = moment().diff(moment(firstTrainTimeBefore), "minutes");

  // Time apart (remainder)
  var remainder = timeDiff % frequency;

  // Minute Until Train
  var minsAway = frequency - remainder;

  // Next Train
  var nextTrain = moment().add(minsAway, "minutes").format("HH:mm");

  // Create the new row and give each row a class with the trainData child name as its value 
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),    
    $("<td>").text(nextTrain),    
    $("<td>").text(minsAway),
    $("<td>").html("<button class='delete' data-train='" + trainDataChild + "'><i class='glyphicon glyphicon-trash'></button>")        
  );

console.log(newRow);
  // Append the new row to the table

  $("#schedule-table > tbody").append(newRow);


  //Delete each existing train data
  $(document).on("click", ".delete", function() {

    var trainKey = $(this).attr("data-train");

    database.ref("trainData/" + trainKey).remove();

    location.reload();
  });

});




