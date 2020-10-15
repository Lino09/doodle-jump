 document.addEventListener('DOMContentLoaded', () => {
     const grid = document.querySelector('#grid')
     const doodler = document.createElement('div')
     let doodlerLeftSpace = 50
     let startPoint = 150
     let doodlerBottomSpace = startPoint
     let isGameOver = false
     const platformCount = 5
     let platforms = []
     let upTimerId
     let downTimerId
     let isJumping = true
     let isGoingLeft = false
     let isGoingRight = false
     let leftTimerId
     let rightTimerId
     let score = 0;
     let downPlatId

     // CLASS

     class Platform {
         constructor(newPlatformBottom) {
             this.bottom = newPlatformBottom
             this.left = Math.random() * 315
             this.visual = document.createElement('div')

             const visual = this.visual
             visual.classList.add('platform')
             visual.style.left = this.left + 'px'
             visual.style.bottom = this.bottom + 'px'
             grid.appendChild(visual)
         }
     }

     //ELEMENT CREATION

     function createPlatform() {
         for (let i = 0; i < platformCount; i++) {
             let platformGap = 600 / platformCount
             let newPlatformBottom = 100 + i * platformGap
             let newPlatform = new Platform(newPlatformBottom)
             platforms.push(newPlatform)
         }
     }

     function createDoodler() {
         grid.appendChild(doodler)
         doodler.classList.add('doodler')
         doodlerLeftSpace = platforms[0].left + 12
         doodler.style.left = doodlerLeftSpace + 'px'
         doodler.style.bottom = doodlerBottomSpace
     }


     //DOODLER FUNCTIONS

     function jump() {
         clearInterval(downTimerId)
         isJumping = true;
         upTimerId = setInterval(function () {
             doodlerBottomSpace += 20
             doodler.style.bottom = doodlerBottomSpace + 'px'
             if (doodlerBottomSpace > startPoint + 200) {
                 fall()
             }
         }, 30)
     }

     function fall() {
         clearInterval(upTimerId)
         isJumping = false;
         downTimerId = setInterval(function () {
             doodlerBottomSpace -= 7
             doodler.style.bottom = doodlerBottomSpace + 'px'
             if (doodlerBottomSpace <= 0) {
                 gameOver()
             }
             platforms.forEach(platform => {
                 if (
                     (doodlerBottomSpace >= platform.bottom) &&
                     (doodlerBottomSpace <= platform.bottom + 15) &&
                     ((doodlerLeftSpace + 60) >= platform.left) &&
                     (doodlerLeftSpace <= (platform.left + 85)) &&
                     !isJumping) {
                     console.log("landed")
                     startPoint = doodlerBottomSpace
                     jump()
                 }
             })
         }, 30)
     }

     function control(e) {
         if (e.key === "ArrowLeft" && !isGoingLeft) {
             moveLeft()
         } else if (e.key === "ArrowRight" && !isGoingRight) {
             moveRight()
         } else if (e.key === "ArrowUp") {
             moveStraight()
         }
     }

     function moveStraight() {
         isGoingRight = false
         isGoingLeft = false
         clearInterval(rightTimerId)
         clearInterval(leftTimerId)
     }

     function moveLeft() {
         clearInterval(rightTimerId)
         isGoingRight = false
         isGoingLeft = true
         leftTimerId = setInterval(function () {
             if (doodlerLeftSpace >= 0 && !isGameOver) {
                 doodlerLeftSpace -= 4
                 doodler.style.left = doodlerLeftSpace + 'px'
             } else moveRight()
         }, 30)


     }

     function moveRight() {
         clearInterval(leftTimerId)
         isGoingRight = true
         isGoingLeft = false
         rightTimerId = setInterval(function () {
             if (doodlerLeftSpace <= 340 && !isGameOver) {
                 doodlerLeftSpace += 4
                 doodler.style.left = doodlerLeftSpace + 'px'
             } else moveLeft()
         }, 30)


     }

     //PLATFORM FUNCTION AND SCORE

     function movePlatforms() {
         if (doodlerBottomSpace > 150) {
             platforms.forEach(platform => {
                 platform.bottom -= 5
                 let visual = platform.visual
                 visual.style.bottom = platform.bottom + 'px'
                 if (platform.bottom < 10) {
                     let firstPlatform = platforms[0].visual
                     firstPlatform.classList.remove('platform')
                     platforms.shift()
                     let newPlatform = new Platform(585)
                     platforms.push(newPlatform)
                     score++
                 }
             })
         }
     }


     //GAME OVER

     function gameOver() {
         console.log('Game Over')
         isGameOver = true
         clearInterval(upTimerId)
         clearInterval(downTimerId)
         while (grid.firstChild) {
             grid.removeChild(grid.firstChild)
         }
         grid.style.background = "url('./media/froze-bg.png') blue "
         let newDiv = document.createElement("span");
         newDiv.innerHTML =  score
         grid.appendChild(newDiv)
     }


     //START GAME

     function start() {
         score = 0;
         if (!isGameOver) {
             createPlatform()
             createDoodler()
             downPlatId = setInterval(movePlatforms, 30)
             jump()
             document.addEventListener('keyup', control)
         }
     }
     startButton = document.getElementById('startButton')
     startButton.onclick = function (){
         startButton.style.display = "none"
         start()
     }

 })