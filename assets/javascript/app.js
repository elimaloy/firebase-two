
$.ajax({
    url: queryURL,
    method: "GET"
   }).then(function(response) {
    $("#movie-view").text(JSON.straigify(response));
   }

$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyBuNzyIQskyfy_BQ60QTpesGlXbHsvTWQs",
        authDomain: "lm-cdc-activities.firebaseapp.com",
        databaseURL: "https://lm-cdc-activities.firebaseio.com",
        projectId: "lm-cdc-activities",
        storageBucket: "",
        messagingSenderId: "263521770177",
        appId: "1:263521770177:web:a36cab67c1dd4ccfbb1240"
      };
      
    
    firebase.initializeApp(firebaseconfig);

    var database = firebase.database();

    // Var
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function() {
        event.preventDefault();
        
        
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function(childSnapshot) {
        var minAway;
         
        
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        var minAway = childSnapshot.val().frequency - remainder;
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

    
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
});