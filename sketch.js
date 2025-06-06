// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let gameStarted = false;
let wordList = ["apple", "banana", "orange", "grape", "peach"]; // 全民英檢中級單字庫
let currentWord = "";
let scrambledWord = "";

function setup() {
  createCanvas(640, 480);

  try {
    // Try to access the video device
    video = createCapture(VIDEO, { flipped: true });
    video.hide();

    // Initialize HandPose model
    handPose = ml5.handPose(video, { flipped: true }, () => {
      console.log("Model loaded!");
    });

    // Listen for predictions
    handPose.on("predict", gotHands);
  } catch (error) {
    console.error("Error accessing video device:", error);
    alert("Unable to access the camera. Please check your device and browser permissions.");
  }

  // Set initial word
  currentWord = "START";
}

function gotHands(results) {
  hands = results;
}

function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      // Loop through keypoints and draw circles
      for (let keypoint of hand.keypoints) {
        // Color-code based on left or right hand
        if (hand.handedness === "Left") {
          fill(255, 0, 255);
        } else {
          fill(255, 255, 0);
        }

        noStroke();
        circle(keypoint.x, keypoint.y, 16);
      }
    }
  }

  if (!gameStarted) {
    drawStartScreen();
  } else {
    drawGameScreen();
  }
}

function drawStartScreen() {
  // Draw START button
  fill(255);
  rect(width / 2 - 100, height / 2 - 50, 200, 100);
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(currentWord, width / 2, height / 2);
}

function drawGameScreen() {
  // Display scrambled word
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(scrambledWord, width / 2, height / 2);
}

function mousePressed() {
  console.log(hands);

  if (!gameStarted) {
    // Check if START button is clicked
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 - 50 &&
      mouseY < height / 2 + 50
    ) {
      gameStarted = true;
      generateScrambledWord();
    }
  }
}

function generateScrambledWord() {
  // Pick a random word from the word list
  currentWord = random(wordList);

  // Scramble the word
  scrambledWord = currentWord
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}
