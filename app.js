// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.toDo-form');
const inputItems = document.querySelector('.todo-input');
const submitBtn = document.querySelector('#submitBtn');
const listContainer = document.querySelector('.toDo-container');
const list = document.querySelector('.toDo-list');
const clearBtn = document.querySelector('#clear-btn');
//console.log(submitBtn.value);
// edit option
let editElement;
let editFlag = false;
let editId = '';
// ****** EVENT LISTENERS **********
//submit form
form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  //console.log(inputItems.value);
  const value = inputItems.value;
  //unique id we can use millisecond for unique id but that is not the best approach
  const id = new Date().getTime().toString();

  if (value !== '' && editFlag === false) {
    createListItem(id, value);
    displayAlert('item added to the list', 'success');
    
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value !== '' && editFlag === true) {
    editElement.innerHTML = value;
    addToLocalStorage(editId, value);
    displayAlert('List is updated', 'success');
    setBackToDefault();
  } else {
    displayAlert('please enter value', 'danger');
  }
}
function clearItems() {
  const items = document.querySelectorAll('.toDo-item');
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  clearBtn.classList.add('hide-clear-btn');
  displayAlert('empty list', 'danger');
  setBackToDefault();
  localStorage.clear();
}
function editItem(e) {
  const inputValue =
    e.currentTarget.parentElement.previousElementSibling.textContent;
  inputItems.value = inputValue;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  submitBtn.value = 'Edit';
  editFlag = true;
  editId = e.currentTarget.parentElement.parentElement.getAttribute('data-id');
}
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);

  if (list.children.length === 0) {
    clearBtn.classList.add('hide-clear-btn');
  }
  displayAlert(`item removed`, `danger`);
  setBackToDefault();
  removeFromLocalStorage(id);
}

//display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  //remove alert
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// ****** LOCAL STORAGE **********

function addToLocalStorage(id, value) {
  const list = { id, value };
  let items = getLocalStorage();
  items.push(list);
  localStorage.setItem('list', JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem('list', JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

function setBackToDefault() {
  inputItems.value = '';
  editFlag = false;
  editId = '';
  submitBtn.value = 'Submit';
}
// ****** SETUP ITEMS **********

function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
  }
}

function createListItem(id, value) {
  const element = document.createElement('article');
  element.classList.add('toDo-item');
  //add id
  let attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button class="edit-btn" type="button">
                <i class="fas fa-edit"></i>
              </button>
              <button class="delete-btn" type="button">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');
  //delet item event listener
  deleteBtn.addEventListener('click', deleteItem);
  //edit event listener
  editBtn.addEventListener('click', editItem);
  list.appendChild(element);
  clearBtn.classList.add('clear-btn');
  clearBtn.classList.remove('hide-clear-btn');
}
