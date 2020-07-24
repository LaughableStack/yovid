const dayUnit = (1000*60*60*24);
let dayBeginning = Math.floor((new Date()).getTime()/dayUnit)*dayUnit;
let statusNames = ["Unsubmitted", "Under Suspicion", "Present & Healthy"]
function status(user) {
    return (user.lastEntry>dayBeginning ? (user.lastResult ? 2 : 1) : 0)
}
function prepareData(users) {
    let table = [
    ['Status', 'Count']]
    for (i in statusNames) {
        table.push([statusNames[i],users.filter(u => status(u) == i).length])
    }
    console.log(table)
    return google.visualization.arrayToDataTable(table)
}
function newRow(user) {
    let elem = document.createElement("tr")
    let nameChild = document.createElement("td")
    let statusChild = document.createElement("td")
    nameChild.appendChild(document.createTextNode(user.name))
    statusChild.appendChild(document.createTextNode(statusNames[status(user)]))
    elem.appendChild(nameChild)
    elem.appendChild(statusChild)
    return elem
}
Promise.all([google.charts.load('current', {'packages':['corechart']}),fetch("api/getAllUsers",{headers: {'Accept': 'application/json','Content-Type': 'application/json'},method: "POST", body: "{}"}).then(result => result.json())]).then((responses) => {
        let users = responses[1];
        let students = users.filter(u => !u.staff);
        let staff = users.filter(u => u.staff);
        var studentChart = new google.visualization.PieChart(document.getElementById('students'));
        var staffChart = new google.visualization.PieChart(document.getElementById('staff'));
        var studentTable = document.getElementById("studentTable")
        var staffTable = document.getElementById("staffTable")
        studentChart.draw(prepareData(students), {"title": "Student Statuses"});
        staffChart.draw(prepareData(staff), {"title": "Staff Statuses"});
        students.forEach(student => {
            studentTable.appendChild(newRow(student))
        })
        staff.forEach(staffMember => {
            staffTable.appendChild(newRow(staffMember))
        })
})
