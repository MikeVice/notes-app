// let notes = [{
//     name: '',
//     dateAdded: '',
//     category: '',
//     content: '',
//     dates: ''
// }];


displayNotes();
let addBtn = document.getElementById('addBtn');
let edtBtn = document.getElementById('edtBtn');
let archiveBtn = document.getElementById('archiveBtn');
let openBtn = document.getElementById('openBtn');
let currIndex = 0;
let allNotesObj = {
    list : [],
    archive : []
};
let archiveStatus = 1;
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
    let tempObj = { name: noteName.value, dateAdded: notesObj[currIndex].dateAdded, category: noteCategory.value, content: noteContent.value };
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
	
	
	//pushing into local storage
	let tempObj = { name: noteName.value, dateAdded: dateTime, category: noteCategory.value, content: noteContent.value };
	
	notesObj.push(tempObj);
    allNotesObj.list = notesObj;
	localStorage.setItem('notes',JSON.stringify(allNotesObj));
	
	noteName.value = '';
	
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
	
	notesObj.splice(index,1);
    if (archiveStatus != 0){
        allNotesObj.list = notesObj;
    } else {
        allNotesObj.archive = notesObj;
    }
	localStorage.setItem('notes',JSON.stringify(allNotesObj));
	
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
        
        if(notesString == null){
            notesObj = [];
        }
        else{
            notesObj = JSON.parse(notesString);
        }
        notesObj.list.push(tempObj);
    }
    allNotesObj = notesObj;
	localStorage.setItem('notes',JSON.stringify(notesObj));
	
	displayNotes(archiveStatus == 1 ? 0 : 1);
}