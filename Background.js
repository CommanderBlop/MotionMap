//set variables
let width = 600; //canvas dimension
let height = 150;
let dogPic;
let dogFlipPic;
let next_arrow = 0; //next location for arrow
let x_pos; //x-position in pixel value
let t;
let arrowList = []; //
let sim_state = true;
let output = [
  ["Time(t)", "Position(m)", "Velocity(m/s)"]
]; //output the table
let MMToggle = false; //motion map toggle
let isPaused = true; //start paused
let lengthBetweenDots; //length between each arrow dot
let btn; //download button
let btnP; //pause/start button
let pChange; //pause button text change
let btnMM; //motion map toggle button
let MMChange; //motion map toggle text change


//scaling function for next_x() to work correctly
function nx(x) {
  return x_pos + (next_x(x) - x) * 50;
}

//load dog pic
function preload() {
  dogPic = loadImage("dog.png");
  dogFlipPic = loadImage("dog_flip.png");
}

//draws the background
function drawBack(needDog) {
  fill("lightgreen");
  rect(0, 0, width, height);
  fill("black");
  rect(25, 97, 550, 5);
  triangle(590, 100, 575, 90, 575, 110);
  textSize(20);
  text("Time Between Dots: " + timeBetweenDot + "s", 20, 40);
  
  for (let i = 25; i <= 525; i += 50) { //set the scale
    rect(i, 90, 5, 20);
    textSize(16);
    text((i - 25) / 50, i, 125);
  }

  for (let i = 0; i < arrowList.length; i++) { //draw all the recorded arrows
    arrow(arrowList[i]);
  }
  text("x (m)", 560, 130);
  if(needDog) {
    imageMode(CENTER); //print the doggie
    if (velocity > 0)
      image(dogPic, x_pos, 70);
    else
      image(dogFlipPic, x_pos, 70);

  }
}

//initialization
function setup() {
  createCanvas(600, 400);
  
  btnmm = document.getElementById("buttonMM") //button to toggle motion map
  MMChange = document.getElementById("buttonMMtext"); //toggle button map
  btnmm.onclick = function() { //when the button is clicked, toggle the name and motion map state
    if (MMToggle) {
      MMChange.innerHTML = "Toggle On";
    } else {
      MMChange.innerHTML = "Toggle Off";
    }
    MMToggle = !MMToggle; //toggle on/off
      drawBack(sim_state || isPaused);//if the simulation has ended, refresh with/without motion map
  }
  
  btnP = document.getElementById("buttonP") //button to toggle start/pause
  pChange = document.getElementById("buttonPtext"); //toggle pause button
  btnP.onclick = function() {
    if(isPaused) {
      pChange.innerHTML = "Pause";
    } else {
      pChange.innerHTML = "Resume";
    }
    isPaused = !isPaused; //toggle start/pause
  }
    
  if (initial_position > 10 || initial_position < 0) { //if the input location is not valid
    btnmm.style.visibility = "hidden";
    clear();
    textSize(32);
    sim_state = false;
    background(255);
    textFont('Georgia');
    text("Invalid starting position. \nPlease pick from 0 to 10.", 50, 150);
  } else if(next_x(1) != (1 + velocity * delta_t)) { //check next_x
    clear();
    textSize(32);
    simState = false;
    background(255, 255, 255);
    textFont('Georgia');
    text("Check the next_x function again!", 100, 200);
  } else {
    frameRate(1 / delta_t);
    x_pos = initial_position * 50 + 25; //scale the input position to pixel scale
    t = 0;
    lengthBetweenDots = velocity * timeBetweenDot * 50;
    next_arrow = x_pos + 2; //tweak the starting position to make dot look nicer
    drawBack(false);
  }
}

//the arrow function takes in a x-coordinate and draws the arrow
function arrow(x) { 
  if (velocity > 0) { //positive direction arrow if velocity is positive
    if (MMToggle) { //if the motion map is on, draw arrow
      fill("black");
      circle(x, 72.5, 10);
      rect(x, 70, lengthBetweenDots * 0.6, 5);
      triangle(x + lengthBetweenDots * 0.8, 72.5, x + lengthBetweenDots * 0.6, 65, x + lengthBetweenDots * 0.6, 80);
    }
    return x + lengthBetweenDots; //the next x-coordinate for the next arrow
    
  } else { //negative direction arrow if the velocity is negative
    if (MMToggle) { //if the motion map is on, draw arrow
      fill("black");
      circle(x, 72.5, 10);
      rect(x, 70, lengthBetweenDots * 0.6, 5);
      triangle(x + lengthBetweenDots * 0.8, 72.5, x + lengthBetweenDots * 0.6, 65, x + lengthBetweenDots * 0.6, 80);
    }
    return x - lengthBetweenDots; //the next x-coordinate for arrow
  }
}

//export data to csv file
//reference: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
function initCSV() {
  //output csv
  let csvContent = "data:text/csv;charset=utf-8,";
  output.forEach(function(rowArray) {
    let rows = rowArray.join(",");
    csvContent += rows + "\r\n";
  });

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "MotionMap.csv");
  document.body.appendChild(link);
  link.click(); // This will download the data file named "MotionMap.csv".
}

//main loop
function draw() {
  if (sim_state && !isPaused) { //if the simulation is currently running
    let x_scale = (x_pos - 25) / 50; //scale the current x-position and add to output
    output.push([t.toFixed(2), x_scale.toFixed(2), (x_scale / t).toFixed(2)]);
    drawBack(false);

    //check if the simulation has ended, if not, increment movement
    if ((nx(x_pos) >= 525 && velocity > 0) || (nx(x_pos) <= 25 && velocity < 0)) {     
      sim_state = false;
    } else {
      x_pos = nx(x_pos);
    }
    
    t += delta_t; //increment time
    
    //check if the next location for arrow has arrived
    if (next_arrow <= x_pos && velocity > 0) { 
      arrowList.push(next_arrow);
      next_arrow += lengthBetweenDots;
    } else if (next_arrow >= x_pos && velocity < 0) {
      arrowList.push(next_arrow);
      next_arrow += lengthBetweenDots;
    }
    
    imageMode(CENTER); //print the doggie
    if (velocity > 0)
      image(dogPic, x_pos, 70);
    else
      image(dogFlipPic, x_pos, 70);


    if (!sim_state) { //if the simulation has just ended inside the loop
      btnP.style.visibility = "hidden";
      let x_last_scale = (nx(x_pos) - 25) / 50; //record the last set of data
      output.push([t.toFixed(2), x_last_scale.toFixed(2), (x_scale / t).toFixed(2)]);
      drawBack(false);
      btn = document.getElementById("button")
      btn.style.visibility = "visible"; //make download data button visible at the end
      btn.onclick = function() {
        initCSV();
      }
    }
  }
}