// let notes = [{
//     name: '',
//     dateAdded: '',
//     category: '',
//     content: '',
//     dates: ''
// }];



let categoryArr = [{name: "TEST", class: "bi-cart", active: 0, archive:0}, {name: "Task", class: "bi-cart", active: 0, archive:0}, {name: "Random thougth", class: "bi-lightbulb", active: 0, archive:0}, {name: "Idea", class: "bi-gem", active: 0, archive:0}];
let addBtn = document.getElementById('addBtn');
let edtBtn = document.getElementById('edtBtn');
let archiveBtn = document.getElementById('archiveBtn');
let openBtn = document.getElementById('openBtn');
//let body = document.getElementsByTagName('body')[0];
let currIndex = 0;
let allNotesObj = {
    list : [],
    archive : [],
    stats : []
};
let archiveStatus = 1;



window.addEventListener('load',function(){
    initCategory();
    displayNotes();
    updateStats();
});

archiveBtn.addEventListener('click',function(){
    displayNotes(archiveStatus);
    if (archiveStatus == 1) {
        archiveBtn.innerHTML = '<i class="bi bi-archive-fill"></i>';
        openBtn.style.display = "none";
        archiveStatus = 0;
    } else {
        archiveBtn.innerHTML = '<i class="bi bi-archive"></i>';
        openBtn.style.display = "block";
        archiveStatus = 1;
    }
});

function updateStats() {
    let table = document.getElementById("statTable");
    let html = "";
    for (let i = 0; i < categoryArr.length; i++){
        html += `<tr><th class="cell-collapse" scope="row"><i class="bi ${categoryArr[i].class}"></i> ${categoryArr[i].name} </th><td>${categoryArr[i].active}</td><td>${categoryArr[i].archive}</td></tr>`;
    }
    table.innerHTML = html;
}

function initCategory() {
    let selectOptions = document.getElementById("noteCategory"); 
    for (let i = 0; i<categoryArr.length; i++){
        let opt = document.createElement('option');
        opt.value = categoryArr[i].name;
        opt.innerHTML = categoryArr[i].name;
        selectOptions.appendChild(opt);
    }
}

edtBtn.addEventListener('click',function(){
    let notesObj;
	let notesString = localStorage.getItem('notes');
	
	if(notesString == null){
		notesObj = [];
	}
	else{
		notesObj = JSON.parse(notesString).list;
	}
    let noteName = document.getElementById('noteName');
    let noteCategory = document.getElementById('noteCategory');
    let noteContent = document.getElementById('noteContent');
    let currentCategory = 0;
    for (let i = 0; i < categoryArr.length; i++){
        if (noteCategory.value == categoryArr[i].name) currentCategory = categoryArr[i];
    }
    let tempObj = { name: noteName.value, dateAdded: notesObj[currIndex].dateAdded, category: currentCategory, content: noteContent.value };
	notesObj[currIndex]=tempObj;
    allNotesObj.list = notesObj;
    addBtn.style.display = "block";
    edtBtn.style.display = "none";
	localStorage.setItem('notes',JSON.stringify(allNotesObj));
    noteName.value = "";
    noteCategory.value = "";
    noteContent.value = "";
    displayNotes();
});

// below event listener will add user input into the local storage
addBtn.addEventListener('click',function(){
	
	let notesObj;
	let noteName = document.getElementById('noteName');
    let noteCategory = document.getElementById('noteCategory');
    let noteContent = document.getElementById('noteContent');
	let notesString = localStorage.getItem('notes');
	
	if(notesString == null){
		notesObj = [];
	}
	else{
		notesObj = JSON.parse(notesString).list;
	}
	
	//Add date
	let now = new Date();
	let dateTime = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
	
    let currentCategory = 0;
    for (let i = 0; i < categoryArr.length; i++){
        if (noteCategory.value == categoryArr[i].name){
            currentCategory = categoryArr[i];
            categoryArr[i].active++;
        }
    }
	
	//pushing into local storage
	let tempObj = { name: noteName.value, dateAdded: dateTime, category: currentCategory, content: noteContent.value, dates : dateDetector(noteContent.value)};
	
	notesObj.push(tempObj);
    allNotesObj.list = notesObj;
    allNotesObj.stats = categoryArr;
	localStorage.setItem('notes',JSON.stringify(allNotesObj));
	
	noteName.value = '';
	updateStats();
	displayNotes();
});

function displayNotes(source){
    if (!source) source = 0;
	let notesObj;
	let notesString = localStorage.getItem('notes');
	
	if(notesString == null){
		notesObj = [];
	}
	else{
        if (source == 0){
            notesObj = JSON.parse(notesString).list;
        } else {
            notesObj = JSON.parse(notesString).archive;
        }
        if (JSON.parse(notesString).stats.length>0){
            categoryArr=JSON.parse(notesString).stats;
        }
	}
	
	let html = '';
	
	notesObj.forEach(function(element,index){
        /*var current
        for (var i = 0; i < categoryArr.length; i++){

        };*/
		html += `
                <tr>
                    <th class="cell-collapse" scope="row"><i class="bi ${element.category.class}"></i> ${element.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")} </th>
                    <td>${element.dateAdded}</td>
                    <td>${element.category.name}</td>
                    <td class="cell-collapse">${element.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
                    <td>${element.dates}</td>
                    <td class="text-right"><span onclick=editeNote(${index})><i data-toggle="modal" data-target="#exampleModal"  class="bi bi-pencil"></i></span> <span onclick=archiveNote(${index})><i class="bi bi-archive"></i></span> <span onclick=deleteNote(${index})><i class="bi bi-trash"></i></span></td>
                </tr>
			`;
	});
	
	let noteElement = document.getElementById('noteElement');
	
	if(notesObj.length != 0){
		noteElement.innerHTML = html;
	}
	else{
		noteElement.innerHTML = '<h3 style="text-align: center; color: grey;">Nothing to display</h3>';
	}
	
}

function deleteNote(index){
	let notesObj;
	let notesString = localStorage.getItem('notes');
	
	if(notesString == null){
		notesObj = [];
	}
	else{
		if (archiveStatus != 0){
            notesObj = JSON.parse(notesString).list;
        } else {
            notesObj = JSON.parse(notesString).archive;
        }
	}
	for (let i = 0; i < categoryArr.length; i++){
        if (notesObj[index].category.name == categoryArr[i].name){
            if (archiveStatus != 0){
                categoryArr[i].active--;
            } else {
                categoryArr[i].archive--;
            }
        }
    }
	notesObj.splice(index,1);
    
    if (archiveStatus != 0){
        allNotesObj.list = notesObj;
    } else {
        allNotesObj.archive = notesObj;
    }
    allNotesObj.stats = categoryArr;
	localStorage.setItem('notes',JSON.stringify(allNotesObj));
	updateStats();
	displayNotes();
}

function editeNote(index){
	let notesObj;
	let notesString = localStorage.getItem('notes');
	
	if(notesString == null){
		notesObj = [];
	}
	else{
		if (archiveStatus != 0){
            notesObj = JSON.parse(notesString).list;
        } else {
            notesObj = JSON.parse(notesString).archive;
        }
	}
	var myModal = new bootstrap.Modal(document.getElementById('exampleModal'))
    myModal.show();
    edtBtn.style.display = "block";
    addBtn.style.display = "none";

    let noteName = document.getElementById('noteName');
    let noteCategory = document.getElementById('noteCategory');
    let noteContent = document.getElementById('noteContent');

    noteName.value = notesObj[index].name;
    noteCategory.value = notesObj[index].category;
    noteContent.value = notesObj[index].content;

    currIndex = index;
}

function archiveNote(index){
	let notesObj;
	let notesString = localStorage.getItem('notes');
	
	if(notesString == null){
		notesObj = [];
	}
	else{
		notesObj = JSON.parse(notesString);
	}

	if (archiveStatus != 0){
        let tempObj = notesObj.list[index];
        deleteNote(index);
        notesString = localStorage.getItem('notes');
        for (let i = 0; i < categoryArr.length; i++){
            if (notesObj.list[index].category.name == categoryArr[i].name){
                categoryArr[i].archive++;
            }
        }
        if(notesString == null){
            notesObj = [];
        }
        else{
            notesObj = JSON.parse(notesString);
        }
        notesObj.archive.push(tempObj);
    } else {
        let tempObj = notesObj.archive[index];
        deleteNote(index);
        notesString = localStorage.getItem('notes');
        for (let i = 0; i < categoryArr.length; i++){
            if (notesObj.archive[index].category.name == categoryArr[i].name){
                categoryArr[i].active++;
            }
        }
        if(notesString == null){
            notesObj = [];
        }
        else{
            notesObj = JSON.parse(notesString);
        }
        notesObj.list.push(tempObj);
    }
    allNotesObj = notesObj;
    allNotesObj.stats = categoryArr;
	localStorage.setItem('notes',JSON.stringify(notesObj));
	updateStats();
	displayNotes(archiveStatus == 1 ? 0 : 1);
}

function dateDetector(str){
    let re = /([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})/g;
    let found = str.match(re);
    if (found != null) {
        if (found.length > 1) {
            found.join(', ');
        } else {
            return found[0];
        } 
    } else {
        found = "";
    }
    return found;
}