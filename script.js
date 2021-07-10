const upgrades = [
    {name: "Human", bps: 1, cost: 50},
    {name: "Robot", bps: 3, cost: 100},
    {name: "Ape", bps: 10, cost: 500},
    {name: "Banana farm", bps: 100, cost: 10000},
]


if (typeof(Storage) !== "undefined") {
  
    const nameStep = document.querySelector(".name")
    const gameDiv = document.querySelector(".game")
    const nameContinue = document.querySelector("button#name-continue")
    const monkeyNameInput = document.querySelector('.name > input[type="text"]')
    const monkeyName = document.querySelector(".monkeyname")
    const bpsCount = document.querySelector(".bps")
    const bananaCount = document.querySelector(".bananacount")
    const upgradesList = document.querySelector(".upgrades")
    let monkeyBPS = 0

    if(!localStorage.getItem("name")){
        nameStep.classList.add("visible")
    }else{
        startGame()
    }


    nameContinue.onclick = () => {
        if(!monkeyNameInput.value) {
            alert("You forgot to enter a name for your monkey!")
        } else {
            nameStep.classList.remove("visible")
            localStorage.setItem("name", monkeyNameInput.value)
            localStorage.setItem("bananas", 100)
            localStorage.setItem("upgrades", JSON.stringify({}))
            startGame()
        }
    }

    function purchase(upgrade){
        if(!localStorage.getItem("name")) return;
        const balance = parseInt(localStorage.getItem("bananas"))
        const upgradeObject = upgrades.find(u=>u.name===upgrade)
        if(!upgradeObject) return console.log(upgrade);
        if(balance < upgradeObject.cost) return alert("You do not have enough bananas to purchase that upgrade")
        const upgradesOwned = JSON.parse(localStorage.getItem("upgrades"))
        if(!upgradesOwned[upgrade]) upgradesOwned[upgrade] = 1
        else upgradesOwned[upgrade]++
        const newBalance = balance-upgradeObject.cost
        localStorage.setItem("bananas", newBalance)
        localStorage.setItem("upgrades", JSON.stringify(upgradesOwned))
        upgradeObject.div.querySelector(".owned").innerText=`${upgradesOwned[upgrade]} owned`
        monkeyBPS=0
        Object.entries(upgradesOwned||{}).forEach(([uName, amount])=>{
            const bps = upgrades.find(u=>u.name===uName)?.bps*amount
            if(!bps) return;
            monkeyBPS+=bps
        })
        bpsCount.innerText = monkeyBPS

    }
    
    function startGame(){

        const upgradesOwned = JSON.parse(localStorage.getItem("upgrades"))
        upgrades.forEach((upgrade, index)=>{
            const upgradeDiv = document.createElement("div");
            upgradeDiv.innerHTML = `
            <div class="card" style="width: fit-content;">
            <div class="card-body">
              <div class="text float-start">
                <h5 class="card-title">${upgrade.name}</h5>
                <h6 class="card-subtitle mb-2 text-success">${upgrade.bps} BPS</h6>
                <h6 class="owned card-subtitle text-primary">${upgradesOwned[upgrade.name]||0} owned</h6>
                <h6 class="card-subtitle d-inline-block"><b>Cost:</b> <div class="cost ms-2 float-end">${upgrade.cost} Bananas</div></h3>

            </div>
              <button onclick="purchase('${upgrade.name}')" class="purchasebtn btn ms-4 border rounded border-dark float-end bg-success text-light btn-m">Purchase</button>
            </div>
          </div>`
          const div = upgradesList.appendChild(upgradeDiv);
          upgrades[index].div = div
        })

        Object.entries(upgradesOwned||{}).forEach(([uName, amount])=>{
            const bps = upgrades.find(u=>u.name===uName)?.bps*amount
            if(!bps) return;
            monkeyBPS+=bps
        })
        gameDiv.classList.add("visible")
        monkeyName.innerText = localStorage.getItem("name")
        bananaCount.innerText = localStorage.getItem("bananas")
        bpsCount.innerText = monkeyBPS
        setInterval(()=>{
            localStorage.setItem("bananas",parseInt(localStorage.getItem("bananas"))+monkeyBPS)
            bananaCount.innerText = localStorage.getItem("bananas")
        }, 1000)
    }

  } else {
    document.innerHTML = "In order for this game to work your browser has to support Web Storage...";
  }
