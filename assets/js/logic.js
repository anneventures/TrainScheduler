  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBjKwLYqbURmFwd4WPNmvp7guWspZQrYnQ",
    authDomain: "train-scheduler-1c532.firebaseapp.com",
    databaseURL: "https://train-scheduler-1c532.firebaseio.com",
    projectId: "train-scheduler-1c532",
    storageBucket: "train-scheduler-1c532.appspot.com",
    messagingSenderId: "347956733836"
  };
  
  firebase.initializeApp(config);

var database = firebase.database();  

//Create button for adding new train
$("#add-train-btn").on("click", function(event) {

  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = $("#first-train-time").val().trim();
  var frequency = $("#frequency").val().trim();

  // Add validation code using if and else if



  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainTimeBefore = moment(firstTrainTime, "HH:mm").subtract(1, "years");    

  // Current Time
  var currentTime = moment().format("HH:mm A");
    
  // Difference between the times
  var timeDiff = moment().diff(moment(firstTrainTimeBefore), "minutes");

  // Time apart (remainder)
  var remainder = timeDiff % frequency;

  // Minute Until Train
  var minsAway = frequency - remainder;

  // Next Train
  var nextTrain = moment().add(minsAway, "minutes").format("HH:mm A");

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
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrainTime);
  console.log(newTrain.frequency);
  console.log(newTrain.nextTrain);
  console.log(newTrain.minsAway);
  console.log(newTrain.currentTime);

  alert("New train successfully added");

  // Clears all of the text-boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");


});

//Create Firebase event for adding train to the database and a row in the html when a user adds an entry 
database.ref().on("child_added", function(childSnapshot) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;
  var nextTrain = childSnapshot.val().nextTrain;
  var minsAway = childSnapshot.val().minsAway;

  // Logs train info to console
  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);
  console.log(nextTrain);
  console.log(minsAway);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainTimeBefore = moment(firstTrainTime, "HH:mm").subtract(1, "years");    

  // Current Time
  var currentTime = moment().format("HH:mm A");
    
  // Difference between the times
  var timeDiff = moment().diff(moment(firstTrainTimeBefore), "minutes");

  // Time apart (remainder)
  var remainder = timeDiff % frequency;

  // Minute Until Train
  var minsAway = frequency - remainder;

  // Next Train
  var nextTrain = moment().add(minsAway, "minutes").format("HH:mm A");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),    
    $("<td>").text(nextTrain),    
    $("<td>").text(minsAway)    
  );

  // Append the new row to the table

  $("#schedule-table > tbody").append(newRow);

});