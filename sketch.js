let Engine = Matter.Engine;
let Bodies = Matter.Bodies;
let Composite = Matter.Composite;
let Body = Matter.Body;

let earth;
let world;

let ground;
let wallL;
let wallR;

let blocks = [];

let pSecond = -1;
let pMinute = -1;
let pHour = -1;

let currentColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  noStroke();

  // create an engine
  earth = Engine.create();
  world = earth.world;

  rectMode(CENTER);
  ground = createBox(width / 2, height + 10, width, 20, { isStatic: true });
  wallL = createBox(-10, height / 2, 20, height, { isStatic: true });
  wallR = createBox(width + 10, height / 2, 20, height, { isStatic: true });

  currentColor = color(random(255), random(255), random(255));
}

function draw() {
  background(20);
  Engine.update(earth);

  rect(ground.position.x, ground.position.y, ground.w, ground.h);
  rect(wallL.position.x, wallL.position.y, wallL.w, wallL.h);
  rect(wallR.position.x, wallR.position.y, wallR.w, wallR.h);

  let secondPassed = pSecond != second();
  let minutePassed = pMinute != minute();
  let hourPassed = pHour != hour();

  if (minutePassed) {
    currentColor = color(random(255), random(255), random(255));
  }

  let blockOption = {
    hh: hour(),
    mm: minute(),
    ss: second(),
    color: currentColor,
    scaleRate: 1,
  };

  if (secondPassed) {
    pSecond = second();
    let syze = width / 10;
    blockOption.timeType = "second";
    blockOption.angle = random(0, TWO_PI);
    let b = createBox(width - syze / 2, -syze / 2, syze, syze, blockOption);
    blocks.push(b);
  }

  if (minutePassed) {
    pMinute = minute();
    let syze = width / 10 * 2;
    blockOption.timeType = "minute";
    blockOption.angle = 0;
    let b = createBox(width / 2, -syze / 2, syze, syze, blockOption);
    blocks.push(b);
  }

  if (hourPassed) {
    pHour = hour();
    let syze = width / 10 * 3;
    blockOption.timeType = "hour";
    blockOption.angle = 0;
    let b = createBox(syze / 2, -syze / 2, syze, syze, blockOption);
    blocks.push(b);
  }

  for (let i = 0; i < blocks.length; i += 1) {
    let block = blocks[i];

    let timeType = block.timeType;
    let msg =
      timeType == "second"
        ? block.ss
        : timeType == "minute"
        ? block.mm
        : block.hh;

   const rounded = 10;
    
    push();
    translate(block.position.x, block.position.y);
    rotate(block.angle);
    fill(block.color);
    rect(0, 0, block.w, block.h, rounded, rounded, rounded, rounded);

    fill("white");
    textSize(block.w / 2);
    text(msg, 0, 0);
    pop();

    block.w *= block.scaleRate;
    block.h *= block.scaleRate;
    Body.scale(block, block.scaleRate, block.scaleRate);

    let mDiff = minuteDiff(block.hh, block.mm, hour(), minute());
    let hDiff = Math.abs(block.hh - hour());
    let tooSmall = block.w < 5 && block.h < 5;
    let offScreen =
      block.position.y > height + 100 ||
      block.position.x < -100 ||
      block.position.x > width + 100;

    if (tooSmall || offScreen) {
      Composite.remove(world, block);
      blocks.splice(i, 1);
      i -= 1;
    } else if (mDiff >= 3 && timeType == "second") {
      block.scaleRate = 0.95;
    } else if (hDiff >= 1 && timeType == "minute") {
      block.scaleRate = 0.95;
    } else if (hDiff >= 1 && timeType == "hour") {
      block.scaleRate = 0.95;
    }
  }
}

function createBox(x, y, w, h, options = {}) {
  let box = Bodies.rectangle(x, y, w, h, options);
  box.w = w;
  box.h = h;
  Composite.add(world, box);
  return box;
}

function minuteDiff(hour1, minute1, hour2, minute2) {
  let time1 = hour1 * 60 + minute1;
  let time2 = hour2 * 60 + minute2;

  return Math.abs(time1 - time2);
}
