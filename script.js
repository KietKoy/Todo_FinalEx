const api = 'https://63ef9af7c59531ccf1733da9.mockapi.io/todo/tasks';
const btnNewTask = document.querySelector(".btn-new-task");
const formAdd = document.querySelector(".form-add-container");
const formEdit = document.querySelector(".form-edit-container");
const btnAdd = formAdd.querySelector(".js-btn-add");
const btnEdit = formEdit.querySelector(".js-btn-edit");
const listItemTodo = document.querySelector(".list-item-todo");
const listItemDoing = document.querySelector(".list-item-doing");;
const listItemFinished = document.querySelector(".list-item-finished");
const quantityTodo = document.querySelector(".quantity-todo-item").querySelector('p');
const quantityDoing = document.querySelector(".quantity-doing-item").querySelector('p');
const quantityFinished = document.querySelector(".quantity-finished-item").querySelector('p');
const btnCloseForm = document.querySelectorAll(".js-btn-close-form");
let todoData = [];
let doingData = [];
let finishedData = [];
let draggable = null;
btnNewTask.addEventListener("click", () => {
  formAdd.setAttribute("style", "display: flex");
});
btnAdd.addEventListener("click", () => {
  let isCheckValidData = true;
  const category = formAdd.querySelector('#input-category');
  const title = formAdd.querySelector('#input-tiltle');
  const content = formAdd.querySelector('#input-content');
  [category, title, content].forEach(item => {
    if (!item.value) {
      isCheckValidData = false;
      item.classList.remove("border-green");
      item.classList.add("border-red");
    }
    else {
      item.classList.remove("border-red");
      item.classList.add("border-green");
    }
  })
  if (isCheckValidData) {
    const data = {
      "category": category.value,
      "title": title.value,
      "content": content.value,
      "type": "todo"
    }
    postData(api, data, renderTodoList);
    resetFormAdd();
    formAdd.setAttribute("style", "display: none");
  }
});
btnEdit.addEventListener("click", () => {
  let isCheckValidData = true;
  const id = formEdit.querySelector('#input-id-edit');
  const category = formEdit.querySelector('#input-category-edit');
  const title = formEdit.querySelector('#input-tiltle-edit');
  const content = formEdit.querySelector('#input-content-edit');
  const checkboxs = document.getElementsByName("category");
  let type;
  [category, title, content].forEach(item => {
    if (!item.value) {
      isCheckValidData = false;
      item.classList.remove("border-green");
      item.classList.add("border-red");
    }
    else {
      item.classList.remove("border-red");
      item.classList.add("border-green");
    }
  })
  if (isCheckValidData) {
    checkboxs.forEach(checkbox => {
      if (checkbox.checked) {
        type = checkbox.value;
      }
    })
    const data = {
      "category": category.value,
      "title": title.value,
      "content": content.value,
      "type": type
    }
    console.log(data);
    resetFormEdit();
    putData(api, id.value, data, render);
    formEdit.setAttribute("style", "display: none");
  }
});
for (const value of btnCloseForm) {
  value.addEventListener("click", () => {
    formAdd.setAttribute("style", "display: none");
    formEdit.setAttribute("style", "display: none");
  })
}
function resetFormAdd() {
  const inputs = [document.querySelector('#input-category'), document.querySelector('#input-tiltle'), document.querySelector('#input-content')];
  inputs.forEach(input => {
    input.value = "";
    input.classList.remove("border-green");
    input.classList.remove("border-red");
  })
}
function resetFormEdit() {
  const inputs = [document.querySelector('#input-category-edit'), document.querySelector('#input-tiltle-edit'), document.querySelector('#input-content-edit')];
  inputs.forEach(input => {
    input.value = "";
    input.classList.remove("border-green");
    input.classList.remove("border-red");
  })
}
async function getData(url = '') {
  const response = await fetch(url, {
    method: 'GET',
  });
  return response.json();
}
async function delData(url = '', id = '', callback) {
  const response = await fetch(url + '/' + id, {
    method: 'DELETE',
  })
    .then(() => {
      while (true) {
        let index = todoData.indexOf(todoData.find(e => e.id == id))
        if (index > -1) {
          todoData.splice(index, 1);
          break;
        }
        index = doingData.indexOf(doingData.find(e => e.id == id))
        if (index > -1) {
          doingData.splice(index, 1);
          break;
        }
        index = doingData.indexOf(doingData.find(e => e.id == id))
        finishedData.splice(index, 1);
        break;
      }
    })
    .then(callback)
}
async function postData(url = '', data = {}, callback) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(json => {
      todoData.push(json);
    })
    .then(callback)
}
async function putData(url = '', id = -1, data = {}, callback) {
  const response = await fetch(`${url}/${id}`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(json => {
      while (true) {
        let index = todoData.indexOf(todoData.find(e => e.id == json.id))
        if (index > -1) {
          if (json.type == 'doing') {
            doingData.push(json);
            todoData.splice(index, 1);
          }
          else if (json.type == 'todo') {
            todoData.splice(index, 1, json);
          }
          else {
            finishedData.push(json);
            todoData.splice(index, 1);
          }
          break;
        }
        index = doingData.indexOf(doingData.find(e => e.id == json.id))
        if (index > -1) {
          if (json.type == 'doing') {
            doingData.splice(index, 1, json);
          }
          else if (json.type == 'todo') {
            todoData.push(json);
            doingData.splice(index, 1);
          }
          else {
            finishedData.push(json);
            doingData.splice(index, 1);
          }
          break;
        }
        index = finishedData.indexOf(finishedData.find(e => e.id == json.id));
        if (json.type == 'doing') {
          doingData.push(json);
          finishedData.splice(index, 1);
        }
        else if (json.type == 'todo') {
          todoData.push(json);
          finishedData.splice(index, 1);
        }
        else {
          finishedData.splice(index, 1, json);
        }
        break;
      }
    })
    .then(callback)
}
function renderTodoList() {
  let todoRender = '';
  let dateFormatted;
  for (const value of todoData) {
    dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
    todoRender += `<div class="item todo" draggable="true" id="${value['id']}">
                <div class="header-item">
                  <div class="header-item-left">
                    <a class="type-of-work">${value['category']}</a>
                    <p class="title-of-work">${value['title']}</p>
                  </div>
                  <div class="header-item-right">
                    <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer" onclick="showItemEdit(${value['id']})"></i>
                    <i class="fa-solid fa-trash cursor-pointer" onclick="delItem(${value['id']})"></i>
                  </div>
                </div>
                <div class="work-content">
                  <p class="content">${value['content']}</p>
                  <span class="time-line">
                    <i class="fa-regular fa-clock"></i>
                    <p>${dateFormatted[1]} ${dateFormatted[2]}, ${dateFormatted[3]}</p>
                  </span>
                </div>
              </div>`;
  }
  quantityTodo.innerText = todoData.length;
  listItemTodo.innerHTML = todoRender;
  const todos = document.querySelectorAll('.todo');
  console.log(todos);
  todos.forEach((todo) => {
    todo.addEventListener('dragstart', dragStart)
    todo.addEventListener('dragend', dragEnd)
  });
}
function renderDoingList() {
  let doingRender = '';
  let dateFormatted;
  for (const value of doingData) {
    dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
    doingRender += `<div class="item doing" draggable="true" id="${value['id']}">
                <div class="header-item">
                  <div class="header-item-left">
                    <a class="type-of-work">${value['category']}</a>
                    <p class="title-of-work">${value['title']}</p>
                  </div>
                  <div class="header-item-right">
                    <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer" onclick="showItemEdit(${value['id']})"></i>
                    <i class="fa-solid fa-trash cursor-pointer" onclick="delItem(${value['id']})"></i>
                  </div>
                </div>
                <div class="work-content">
                  <p class="content">${value['content']}</p>
                  <span class="time-line">
                    <i class="fa-regular fa-clock"></i>
                    <p>${dateFormatted[1]} ${dateFormatted[2]}, ${dateFormatted[3]}</p>
                  </span>
                </div>
              </div>`;
  }
  quantityDoing.innerText = doingData.length;
  listItemDoing.innerHTML = doingRender;
  const doings = document.querySelectorAll('.doing');
  doings.forEach((doing) => {
    doing.addEventListener('dragstart', dragStart)
    doing.addEventListener('dragend', dragEnd)
  });
}
function renderFinishedList() {
  let finishedRender = '';
  let dateFormatted;
  for (const value of finishedData) {
    dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
    finishedRender += `<div class="item finished" draggable="true" id="${value['id']}">
                <div class="header-item">
                  <div class="header-item-left">
                    <a class="type-of-work">${value['category']}</a>
                    <p class="title-of-work">${value['title']}</p>
                  </div>
                  <div class="header-item-right">
                    <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer" onclick="showItemEdit(${value['id']})"></i>
                    <i class="fa-solid fa-trash cursor-pointer" onclick="delItem(${value['id']})"></i>
                  </div>
                </div>
                <div class="work-content">
                  <p class="content">${value['content']}</p>
                  <span class="time-line">
                    <i class="fa-regular fa-clock"></i>
                    <p>${dateFormatted[1]} ${dateFormatted[2]}, ${dateFormatted[3]}</p>
                  </span>
                </div>
              </div>`;
  }
  quantityFinished.innerText = finishedData.length;
  listItemFinished.innerHTML = finishedRender;
  const finisheds = document.querySelectorAll('.finished');
  finisheds.forEach((finished) => {
    finished.addEventListener('dragstart', dragStart)
    finished.addEventListener('dragend', dragEnd)
  });
}
function renderfromApi() {
  getDataFromApi(renderTodoList, renderDoingList, renderFinishedList);
}
function render() {
  renderTodoList();
  renderDoingList();
  renderFinishedList();
}
function delItem(id) {
  console.log("del");
  delData(api, id, render);
}
function showItemEdit(id) {
  let item = [...todoData, ...doingData, ...finishedData].find(e => e.id == id);
  const idEdit = formEdit.querySelector('#input-id-edit');
  const category = formEdit.querySelector('#input-category-edit');
  const title = formEdit.querySelector('#input-tiltle-edit');
  const content = formEdit.querySelector('#input-content-edit');
  const checkboxs = document.getElementsByName("category");
  idEdit.value = id;
  category.value = item['category'];
  title.value = item['title'];
  content.value = item['content'];
  checkboxs.forEach(checkbox => {
    if (checkbox.value == item['type']) {
      checkbox.checked = true;
    }
  })
  formEdit.setAttribute('style', 'display:flex');
}
function getDataFromApi(callback1, callback2, callback3) {
  getData(api)
    .then(data => {
      for (const value of data) {
        if (value['type'] == 'todo') {
          todoData.push(value);
        }
        else if (value['type'] == 'doing') {
          doingData.push(value);
        }
        else {
          finishedData.push(value);
        }
      }
    })
    .then(callback1)
    .then(callback2)
    .then(callback3)
  console.log("getdata");
}
renderfromApi();

const listItems = document.querySelectorAll('.list-item');
listItems.forEach(listItem => {
  listItem.addEventListener('dragover', dragOver);
  listItem.addEventListener('dragenter', dragEnter);
  listItem.addEventListener('dragleave', dragLeave);
  listItem.addEventListener('drop', dragDrop);
})
function dragStart() {
  draggable = this;
}
function dragEnd() {
  draggable = null;
}
function dragOver(e) {
  e.preventDefault();
}
let isDrop = false;
function dragEnter() {
  isDrop = true;
}
function dragLeave() {
  isDrop = false;
}
function dragDrop() {
  if(isDrop) {
    const categoryParentOfItem = draggable.parentElement.classList.toString();
    if (categoryParentOfItem.includes('list-item-todo')) {
      const data = todoData.find(e => e.id == draggable.id);
      quantityTodo.innerText = todoData.length - 1;
      if (this.classList.toString().includes('list-item-doing')) {
        quantityDoing.innerText = doingData.length + 1;
        data.type = 'doing';
        putData(api, data.id, data, null);
      }
      else {
        quantityFinished.innerText = finishedData.length + 1;
        data.type = 'finished';
        putData(api, data.id, data, null);
      }
    }
    else if (categoryParentOfItem.includes('list-item-doing')) {
      const data = doingData.find(e => e.id == draggable.id);
      quantityDoing.innerText = doingData.length - 1;
      if (this.classList.toString().includes('list-item-todo')) {
        quantityTodo.innerText = todoData.length + 1;
        data.type = 'todo';
        putData(api, data.id, data, null);
      }
      else {
        quantityFinished.innerText = finishedData.length + 1;
        data.type = 'finished';
        putData(api, data.id, data, null);
      }
    }
    else {
      const data = finishedData.find(e => e.id == draggable.id);
      quantityFinished.innerText = finishedData.length - 1;
      if (this.classList.toString().includes('list-item-todo')) {
        quantityTodo.innerText = todoData.length + 1;
        data.type = 'todo';
        putData(api, data.id, data, null);
      }
      else {
        quantityDoing.innerText = doingData.length + 1;
        data.type = 'doing';
        putData(api, data.id, data, null);
      }
    }
    this.appendChild(draggable);
  }
}