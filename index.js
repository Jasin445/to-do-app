const form = document.querySelector('.important');
const input = document.getElementById('items');
const submit = document.querySelector('.submit');
const clear = document.querySelector(".clear");
const message = document.querySelector('.alert');
const listMain = document.querySelector('.list-flex');
clear.classList.add('visible')


let editFlag = false;
let editElement;
let editID;


form.addEventListener('submit', addItems);

clear.addEventListener('click', clearItems);

window.addEventListener('DOMContentLoaded', () => {
  let storage = getLocalStorage();
  alertEmpty("Welcome Back", "success")
  storage.forEach(x => {
    
    updateDOM(x.id, x.value)
  })
  
})

function addItems(event) {
  event.preventDefault();

  let value = input.value;
  let id = new Date().getTime().toString();

  if (value && !editFlag) {
   updateDOM(id, value)
   alertEmpty("One item added", "success")

  } else if (value && editFlag) {
    editElement.innerHTML = value;
    editLocalStorage(editID, editElement)
    alertEmpty("Item edited", "success")
    setDefault();
    clear.classList.remove('visible')

  } else {
    alertEmpty("No item has been entered!!", "danger");
  }
  
}

function alertEmpty(text, Class) {
  message.textContent = text
  message.classList.add(`alert-${Class}`)

  setTimeout(() => {
    message.textContent = '';
    message.classList.remove(`alert-${Class}`)
  }, 1000);
}

function setDefault() {
  input.value = "";
  editFlag = false;
  editID = "";
  clear.classList.add('visible');
  submit.innerHTML = "Submit";

}


function clearItems() {
  let childrene = document.querySelectorAll(".item-direct-container");
 
  if (childrene.length > 0) {
    childrene.forEach(x => {
      listMain.removeChild(x);
    })
  }

  deleteAllStorage()

    clear.classList.add('visible')
    alertEmpty("All items cleared!!", "danger")
  setDefault();
}

function editList(event) {
  editFlag = true;
  editElement = event.currentTarget.parentElement.previousElementSibling;
 
  editID = event.currentTarget.parentElement.parentElement.dataset.id;
  submit.innerHTML = "Edit";
  
  input.value = editElement.innerHTML;
}

function deleteList(event) {
  let list = event.currentTarget.parentElement.parentElement;
  let childrene = document.querySelectorAll(".item-direct-container");
  list.remove();

  if (childrene.length < 2) {
    list.remove();
    clear.classList.add('visible');
  }
  deleteLocalStorage(list.dataset.id);
  alertEmpty("Item deleted", "danger");
  // setDefault();
}

function setLocalStorage(id, value) {
  let items = { id, value };
  let result = getLocalStorage();

  if (!result.some(x => x.id === id)) {
    
    result.push(items);
  }
  localStorage.setItem('rem', JSON.stringify(result));
  JSON.parse(localStorage.getItem('rem'))
  // console.log(result)
}

function getLocalStorage() {
  return localStorage.getItem('rem') ? JSON.parse(localStorage.getItem('rem')) : [];
}

function deleteLocalStorage(id) {
  let item = getLocalStorage();

  let update = item.filter(x => {
    // console.log(x.id !== id)
   return x.id !== id;
  }
  )

  localStorage.setItem('rem', JSON.stringify(update));
}

function deleteAllStorage() { 
  localStorage.removeItem("rem");
  
}

function editLocalStorage(id, editElement) {
  let item = getLocalStorage();
  let n = item.map(x => {
    if (x.id === id) {
      return { ...x, value: editElement.innerHTML }
    }
   
    return x;
  })
 
  // console.log(n);
  localStorage.setItem('rem', JSON.stringify(n))
}


function updateDOM(id, value) {
  let listContainer = document.createElement('article');
  listContainer.setAttribute('data-id', id);
  listContainer.classList.add('item-direct-container')

  let list = `<p class="item">${value}</p>
        <div class="icon-features flex">
          <i class="fa-solid fa-edit edit-list"></i>
          <i class="fa-solid fa-trash delete-list"></i>
        </div>`
  


  listContainer.innerHTML = list
  listMain.append(listContainer);
  
  let deleteBtn = listContainer.querySelector('.delete-list');
  let editBtn = listContainer.querySelector('.edit-list');
  
  deleteBtn.addEventListener('click', deleteList)
  editBtn.addEventListener('click', editList)
  document.querySelector('.show-container').classList.add('visible');
  setLocalStorage(id, value);
  setDefault();
  clear.classList.remove('visible')
}
