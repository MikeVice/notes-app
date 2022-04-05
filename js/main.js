// Obj = {
//  list : activeNotes;
//  archive : archiveNotes;
//}
// let notes = [{
//     name: '',
//     dateAdded: '',
//     category: '',
//     content: '',
//     dates: ''
// }];


displayNotes();
var addBtn = document.getElementById('addBtn');
let allNotesObj = {
    list : [],
    archive : []
};

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
	
	
	//pushing into local storage
	let tempObj = { name: noteName.value, dateAdded: dateTime, category: noteCategory.value, content: noteContent.value };
	
	notesObj.push(tempObj);
    allNotesObj.list = notesObj;
	localStorage.setItem('notes',JSON.stringify(allNotesObj));
	
	noteName.value = '';
	
	displayNotes();
});

function displayNotes(){
	let notesObj;
	let notesString = localStorage.getItem('notes');
	
	if(notesString == null){
		notesObj = [];
	}
	else{
		notesObj = JSON.parse(notesString).list;
	}
	
	let html = '';
	
	notesObj.forEach(function(element,index){
		html += `
                <tr>
                    <th class="cell-collapse" scope="row"><i class="bi bi-cart"></i> ${element.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")} </th>
                    <td>${element.dateAdded}</td>
                    <td>${element.category}</td>
                    <td class="cell-collapse">${element.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
                    <td>03/5/2022, 05/5/2022</td>
                    <td class="text-right"><span onclick=editNote(${index})><i data-toggle="modal" data-target="#exampleModal"  class="bi bi-pencil"></i></span> <span><i class="bi bi-archive"></i></span> <span onclick=deleteNote(${index})><i class="bi bi-trash"></i></span></td>
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
		notesObj = JSON.parse(notesString).list;
	}
	
	notesObj.splice(index,1);
    allNotesObj.list = notesObj;
	localStorage.setItem('notes',JSON.stringify(allNotesObj));
	
	displayNotes();
}