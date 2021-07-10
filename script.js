const upgrades = [
    {name: "Human", bps: 1, cost: 50},
    {name: "Robot", bps: 3, cost: 100},
    {name: "Ape", bps: 10, cost: 500},
    {name: "Banana farm", bps: 20, cost: 10000},
    {name: "Banana bank", bps: 100, cost: 1000000},
    {name: "Banana city", bps: 3000, cost: 10000000},
    {name: "Banana country", bps: 50000, cost: 100000000},
]
class User {
    getAllData(){
        return Object.keys(localStorage).reduce(function(obj, str) { 
            obj[str] = localStorage.getItem(str); 
            return obj
        }, {});
    }
    setData(key, value){
        return localStorage.setItem(key,value)
    }
}

if (typeof(Storage) !== "undefined") {
  const user = new User()
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

    function update(){
        const upgradesOwned = JSON.parse(user.getAllData()?.upgrades)
        upgradesList.innerHTML=""
        upgrades.forEach((upgrade, index)=>{
            const canAfford = user.getAllData()?.bananas > upgrade.cost*((upgradesOwned[upgrade.name]||1)*0.05)
            const upgradeDiv = document.createElement("div");
            upgradeDiv.innerHTML = `

            <div class="card-body">
              <div class="text float-start">
                <h5 class="card-title">${upgrade.name}</h5>
                <h6 class="card-subtitle mb-2 text-warning">${upgrade.bps} BPS</h6>
                <h6 class="owned card-subtitle text-warning">${upgradesOwned[upgrade.name]||0} owned</h6>
                <h6 class="card-subtitle d-inline-block"><b>Cost:</b> <div class="cost ms-2 float-end">${Math.round(upgrade.cost*((upgradesOwned[upgrade.name]||1)*0.05))} Bananas</div></h3>

            </div>
              <button  onclick="purchase('${upgrade.name}')" class="purchasebtn btn ms-4 border rounded border-dark float-end bg-${canAfford?"success":"danger disabled"} text-light btn-m">Purchase</button>
            </div>`
            upgradeDiv.className="card"
          const div = upgradesList.appendChild(upgradeDiv);
          upgrades[index].div = div
        })
        monkeyBPS=0
        Object.entries(upgradesOwned||{}).forEach(([uName, amount])=>{
            const bps = upgrades.find(u=>u.name===uName)?.bps*amount
            if(!bps) return;
            monkeyBPS+=bps
        })
        gameDiv.classList.add("visible")
        monkeyName.innerText = user.getAllData()?.name
        bananaCount.innerText = parseInt(user.getAllData()?.bananas)
        bpsCount.innerText = monkeyBPS
    }

    function purchase(upgrade){
        if(!user.getAllData()?.name) return;
        const balance = parseInt(user.getAllData()?.bananas)
        const upgradeObject = upgrades.find(u=>u.name===upgrade)
        if(!upgradeObject) return console.log(upgrade);
        const upgradesOwned = JSON.parse(user.getAllData()?.upgrades)
        if(balance < upgradeObject.cost*((upgradesOwned[upgrade]||1)*0.05)) return alert("You do not have enough bananas to purchase that upgrade")
        const newBalance = balance-upgradeObject.cost*((upgradesOwned[upgrade]||1)*0.05)
        if(!upgradesOwned[upgrade]) upgradesOwned[upgrade] = 1
        else upgradesOwned[upgrade]++
        user.setData("bananas", newBalance)
        user.setData("upgrades", JSON.stringify(upgradesOwned))

        upgradeObject.div.querySelector(".owned").innerText=`${upgradesOwned[upgrade]} owned`
        upgradeObject.div.querySelector(".cost").innerText=`${Math.round(upgradeObject.cost*((upgradesOwned[upgrade]||1)*0.05))} Bananas`

        monkeyBPS=0
        Object.entries(upgradesOwned||{}).forEach(([uName, amount])=>{
            const bps = upgrades.find(u=>u.name===uName)?.bps*amount
            if(!bps) return;
            monkeyBPS+=bps
        })
        bpsCount.innerText = parseInt(monkeyBPS)
        update()

    }
    let bananaClicked = false
    const banana = document.querySelector(".banana")
    function bananaSuprise(){
        const delay = Math.floor(Math.random()*100000)
        const x = Math.floor(Math.random()*window.innerWidth-200)+200
        const y = Math.floor(Math.random()*window.innerHeight-200)+200
        setTimeout(() => {
            bananaClicked=false
            banana.style.display = "block"
            banana.className = "banana"
            banana.style.top = y+"px";
            banana.style.left = x+"px";
            setTimeout(() => {
                if(!bananaClicked){
                banana.style.display = "none"
            }
            }, 3000);
        }, delay);


    }
    banana.onclick = () => {
        bananaClicked = true;
        banana.style.display = "none"

        const pay = Math.floor(Math.random()*10000)
        user.setData("bananas", parseInt(user.getAllData()?.bananas)+pay)
        bananaSuprise()
    }
    bananaSuprise()

    function startGame(){
        
        setInterval(()=>{
            localStorage.setItem("bananas",parseInt(localStorage.getItem("bananas"))+parseInt(monkeyBPS))
            update()
        }, 1000)
    }

  } else {
    document.innerHTML = "In order for this game to work your browser has to support Web Storage...";
  }