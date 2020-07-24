// Config
let positiveColor = "#11abdc";
let negativeColor = "red";
let positiveMessage = "Go ahead and visit!"
let negativeMessage = "Stay home today."
var buttons;
//Main
let answer = (comm) => (response) => () => {
    comm.answers.push(response);
    let qindex = comm.answers.length;
    if (qindex == comm.integratedPrompts.length) {
        let result = comm.answers.every(a => !a)
        fetch("api/submit",
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: comm.name,
                content: Object.assign( ...comm.integratedPrompts.map((v, i) => ( {[v]: comm.answers[i]}))),
                result: result
            })
        }).then(response => response.json()).then(response => {
            if (response.user) {
                displayVerification(comm.textRegion, comm.name, result)
            }
        })
    } else {
        comm.textRegion.innerHTML = comm.integratedPrompts[qindex];
    }
}
let displayVerification = (display, name, value) => {
    document.getElementById("affirmative").remove();
    document.getElementById("negative").remove();
    display.innerHTML = `${name}<br>${value ? positiveMessage: negativeMessage}`;
    document.body.style = `background-color: ${value ? positiveColor : negativeColor};`;
}
let beginQuestions = (questions, name) => {
    var comm = {
        textRegion: document.getElementById("prompt"),
        integratedPrompts: questions.prompts.concat(questions.symptoms.map(symptom => questions.symptomPrompt+symptom+"?")),
        answers: [],
        name: name
    };
    comm.answerFunc = answer(comm);
    comm.textRegion.innerHTML = comm.integratedPrompts[0];
    buttons[1].onclick = comm.answerFunc(true);
    buttons[0].onclick = comm.answerFunc(false);
}
Promise.all([fetch("access/questions"),fetch("api/getAllUsers",{headers: {'Accept': 'application/json','Content-Type': 'application/json'},method: "POST", body: "{}"})].map(a => a.then(cont => cont.json()))).then(responses => {
    let currentTime = (new Date()).getTime()
    buttons = [document.getElementById("negative"), document.getElementById("affirmative")]
    buttons.forEach(b => b.style.display = "none")
    let staff = (window.location.href.split("/").includes("staff"))
    let unenteredUsers = responses[1].filter(u => (u.lastEntry<(currentTime-(1000*60*60*23) && u.staff == staff)))
    console.log(responses[1])
    let userNames = unenteredUsers.map(u => u.name)
    let nameMenu = document.getElementById("nameSelect")
    userNames.forEach(name => {
        var opt = document.createElement("option");
        opt.value = name;
        opt.innerHTML = name;
        nameMenu.appendChild(opt)
    })
    let confirmationButton = document.getElementById("nameSelectConfirm")
    confirmationButton.onclick = () => {
        buttons.forEach(b => b.style.display = "block")
        nameMenu.style.display = "none"
        confirmationButton.style.display = "none"
        beginQuestions(responses[0],nameMenu.value)
    }
})