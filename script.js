const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let animreq;
let enemyspawn;

//  -----===Player Info===----- //

let thisplayer = {
    highscore: 0,
    currentscore: 0,
    nickname: "player"
}

//  -----===Game Info===----- //

let enemies = []

let bullets = []

let interaction = {
    left: false,
    right: false,
    shooting: false
}

let shooter = {
    x: 200,
    y: 800,
    time_to_shoot: 0,
    bullet_rad: 10,
    bullet_velocity:10,
    shoot() {
        this.time_to_shoot = 30
        let new_bullet = new Bullet(this.x, this.y, this.bullet_rad,this.bullet_velocity)
        bullets.push(new_bullet)
    },
    draw() {
        ctx.fillStyle = 'black';

        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + 30, this.y - 60)
        ctx.lineTo(this.x + 60, this.y)
        ctx.fill()
    }
}

let isingame = false

let leaderboardscores = [
    player = {
        nickname: "player",
        highscore: 100
    },
    player = {
        nickname: "player",
        highscore: 100
    },
    player = {
        nickname: "player",
        highscore: 100
    },
    player = {
        nickname: "player",
        highscore: 100
    },
    player = {
        nickname: "player",
        highscore: 100
    },
    player = {
        nickname: "player",
        highscore: 100
    },
    player = {
        nickname: "player",
        highscore: 100
    },
    player = {
        nickname: "player",
        highscore: 100
    },
    player = {
        nickname: "player",
        highscore: 100
    },
    player = {
        nickname: "player",
        highscore: 100
    },
]

//  -----===Menu Rendering===----- //

function menu() {
    player.currentscore = 0
    ctx.clearRect(0, 0, 600, 900);
    ctx.fillStyle = 'white';
    ctx.font = '30px sans-serif';
    ctx.fillText(player.nickname, 20, 40, 300);
    ctx.fillText("Leaderboard", 400, 40, 300);
    for (let index = 0; index < 10; index++) {
        ctx.font = '20px sans-serif';
        ctx.fillText(leaderboardscores[index].nickname + ": " + leaderboardscores[index].highscore, 400, 80 + (index * 30), 500);
    }
    ctx.font = '20px sans-serif';
    ctx.fillText("YOUR HIGHSCORE: " + thisplayer.highscore, 20, 80, 500);
    ctx.font = '35px sans-serif';
    ctx.fillText("PRESS ENTER TO PLAY", 100, 750);
}
menu()

//  -----===Game Simulation / Rendering===----- //

function game() {
    if (isingame === true) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 600, 900)
        ctx.fillStyle = 'black';
        ctx.font = '35px sans-serif';
        ctx.fillText("score:" + thisplayer.currentscore, 0, 850)

        shooter.draw()

        for (let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i]
            if (bullet.y < 0) {
                bullets.splice(i, 1)
            } else {
                bullet.y -= bullet.bullet_velocity
                bullet.draw()
            }

        }

        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].y > 750) {
                game_over()
                enemies.splice(i, 1)
            } else {
                enemies[i].y += 1
                enemies[i].draw()
            }

        }

        // https://www.youtube.com/watch?v=oOEnWQZIePs

        for (let i = 0; i < bullets.length; i++) {
            for (let ib = 0; ib < enemies.length; ib++) {

                let bullet = bullets[i]
                let enemy = enemies[ib]

                let distX = Math.abs(bullet.x - enemy.x - enemy.width / 2);
                let distY = Math.abs(bullet.y - enemy.y - enemy.height / 2);

                if (distX <= (enemy.width / 2 + bullet.rad) && distY <= (enemy.height / 2 + bullet.rad)) {
                    bullets.splice(i, 1);
                    enemies.splice(ib, 1);
                    thisplayer.currentscore += 1;
                    i--;
                    break;
                }
            }
        }


        if (shooter.time_to_shoot != 0) {
            shooter.time_to_shoot -= 1
        }

        if (interaction.shooting === true && shooter.time_to_shoot === 0) {
            shooter.shoot()
        }

        if (interaction.left === true && shooter.x > 0) {
            shooter.x -= 4
        }
        if (interaction.right === true && shooter.x < 540) {
            shooter.x += 4
        }
    }
    animreq = requestAnimationFrame(game)
}
function spawnenemy(){
    enemyspawn = setInterval(() => {
        let new_enemy = new Enemy(Math.floor(Math.random() * 500 + 50), 0, 100, 50)
        enemies.push(new_enemy)
    }, 1000);
}

let Bullet = class {
    constructor(x, y, rad,vy) {
        this.x = x + 30
        this.y = y
        this.rad = rad
        this.bullet_velocity = vy
        this.draw = function () {
            ctx.fillStyle = 'black';
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2)
            ctx.fill()
        }
    }
}
let Enemy = class {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.draw = function () {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

function game_over() {
    enemies = []
    bullets = []
    isingame = false
    if(thisplayer.currentscore > thisplayer.highscore){
        thisplayer.highscore = thisplayer.currentscore
    }
    cancelAnimationFrame(animreq)
    clearInterval(enemyspawn)
    thisplayer.currentscore = 0
    menu()
}
//  ===Game State Detection===----- //

window.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && isingame === false) {
        isingame = true
        game()
        spawnenemy()
    }
})

//  -----===Player Interaction===----- //

window.addEventListener("keydown", (e) => {

    // interaction

    if (e.key === "a" || e.key === "ArrowLeft") {
        interaction.left = true
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        interaction.right = true
    }

    // shooting

    if (e.key === "w" || e.key === "ArrowUp") {
        interaction.shooting = true
    }
})
window.addEventListener("keyup", (e) => {

    // interaction

    if (e.key === "a" || e.key === "ArrowLeft") {
        interaction.left = false
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        interaction.right = false
    }

    //shooting

    if (e.key === "w" || e.key === "ArrowUp") {
        interaction.shooting = false
    }
})