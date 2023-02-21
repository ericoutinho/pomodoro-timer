let taskTime = 25
let iddleTime = 5
let longIddleTime = 30
let loops = 4

let isRunning = false
let isPaused = false

let interval

const beep = new Audio("./sounds/beep.mp3")
const ping = new Audio("./sounds/ping.mp3")

document.getElementById("pause").addEventListener("click", pause)
document.getElementById("cancel").addEventListener("click", stop)
document.getElementById("start").addEventListener("click", start)

function pause(event) {
    if (!isRunning) {
        return false
    }
    isPaused = !isPaused
    event.target.textContent = (event.target.textContent == "PAUSE") ? "CONTINUE" : "PAUSE"
}

function stop() {
    if (!isRunning) {
        return false
    }
    ping.play()
    clearInterval(interval)
    isRunning = false
    isPaused = false
    document.querySelector(".timer-timer").textContent = "00:00"
    document.querySelector("#pause").textContent = "PAUSE"
    document.querySelector("html").classList.remove("task")
    document.querySelector(".timer-label").textContent = "IDDLE"
    document.querySelectorAll(".dot").forEach( element => element.classList.remove("finish"))
}

async function start() {
    if (isRunning) {
        return false
    }
    isRunning = true
    let iterations = Array(loops).fill(0)
    for (let [index, value] of iterations.entries()) {
        document.querySelector("html").classList.add("task")
        document.querySelector(".timer-label").textContent = "TASK"
        const a = await timer(taskTime)
        beep.play()
        document.querySelector(`.dot:nth-child(${index+1})`).classList.add("finish")

        if ((index + 1) < loops) {
            document.querySelector("html").classList.remove("task")
            document.querySelector(".timer-label").textContent = "IDDLE"
            const b = await timer(iddleTime)
            ping.play()
        } else {
            document.querySelector("html").classList.remove("task")
            document.querySelector(".timer-label").textContent = "LONG IDDLE"
            const c = await timer(longIddleTime)
            ping.play()
        }
    }
    clearInterval(interval)
}

function timer(time) {
    return new Promise(resolve => {
        let timerSeconds = time * 60
        interval = setInterval(() => {
            if (isPaused === false) {
                if (timerSeconds >= 0) {
                    let m = Math.floor(timerSeconds / 60)
                    let s = timerSeconds % 60
                    document.querySelector(".timer-timer").textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
                    timerSeconds--
                } else {
                    // clearInterval(t)
                    resolve("!")
                }
            }
        }, 1000)
    })
}

for (let d = 1; d <= loops; d++) {
    let dot = document.createElement("div")
    dot.classList.add("dot")
    document.querySelector(".timer-dots").appendChild(dot)
}