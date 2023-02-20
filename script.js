const api = 'https://63ef9af7c59531ccf1733da9.mockapi.io/todo/tasks';
const btnNewTask = document.querySelector(".btn-new-task");
const btnEdit = document.querySelectorAll(".js-button-edit")
const formAdd = document.querySelector(".form-add-container");
const btnAdd = formAdd.querySelector(".js-btn-add");
const formEdit = document.querySelector(".form-edit-container");
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
btnNewTask.addEventListener("click", () => {
  formAdd.setAttribute("style", "display: flex");
});
btnAdd.addEventListener("click", () => {
  let isCheckValidData = true;
  const category = document.querySelector('#input-category');
  const title = document.querySelector('#input-tiltle');
  const content = document.querySelector('#input-content');
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
    formAdd.setAttribute("style", "display: none");
  }
});
for (const value of btnCloseForm) {
  value.addEventListener("click", () => {
    formAdd.setAttribute("style", "display: none");
    formEdit.setAttribute("style", "display: none");
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
      let index = todoData.indexOf(todoData.find(e => e.id == id))
      if(index > -1) {
        todoData.splice(index, 1);
      }
      index = doingData.indexOf(doingData.find(e => e.id == id))
      console.log(index);
      if(index > -1) {
        doingData.splice(index, 1);
      }
      index = doingData.indexOf(doingData.find(e => e.id == id))
      if(index > -1) {
        doingData.splice(index, 1);
      }
  })
  .then(callback)
}
async function postData(url = '', data = {}, callback) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json ' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(json => {
      todoData.push(json);
    })
    .then(callback)
}
function renderTodoList() {
  let todoRender = '';
  let dateFormatted;
  for (const value of todoData) {
      dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
      todoRender += `<div class="item">
                <div class="header-item">
                  <div class="header-item-left">
                    <a class="type-of-work">${value['category']}</a>
                    <p class="title-of-work">${value['title']}</p>
                  </div>
                  <div class="header-item-right">
                    <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer" onlick="showItemEdit(${value['id']})"></i>
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
}
function renderDoingList() {
  let doingRender = '';
  let dateFormatted;
  for (const value of doingData) {
      dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
      doingRender += `<div class="item">
                <div class="header-item">
                  <div class="header-item-left">
                    <a class="type-of-work">${value['category']}</a>
                    <p class="title-of-work">${value['title']}</p>
                  </div>
                  <div class="header-item-right">
                    <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer" onlick="showItemEdit(${value['id']})"></i>
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
}
function renderFinishedList() {
  let finishedRender = '';
  let dateFormatted;
  for (const value of finishedData) {
      dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
      finishedRender += `<div class="item">
                <div class="header-item">
                  <div class="header-item-left">
                    <a class="type-of-work">${value['category']}</a>
                    <p class="title-of-work">${value['title']}</p>
                  </div>
                  <div class="header-item-right">
                    <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer" onlick="showItemEdit(${value['id']})"></i>
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
}
// function renderfromApi() {
//   count = [0, 0, 0];
//   getData(api)
//     .then(data => {
//       let todoRender = '';
//       let doingRender = '';
//       let finishedRender = '';
//       let dateFormatted;
//       for (const value of data) {
//         if (value['type'] == 'todo') {
//           totoData.push(value);
//           dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
//           todoRender += `<div class="item">
//                 <div class="header-item">
//                   <div class="header-item-left">
//                     <a class="type-of-work">${value['category']}</a>
//                     <p class="title-of-work">${value['title']}</p>
//                   </div>
//                   <div class="header-item-right">
//                   <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer" onlick="showItemEdit(${value['id']})"></i>
//                   <i class="fa-solid fa-trash cursor-pointer" onclick="delItem(${value['id']})"></i>
//                   </div>
//                 </div>
//                 <div class="work-content">
//                   <p class="content">${value['content']}</p>
//                   <span class="time-line">
//                     <i class="fa-regular fa-clock"></i>
//                     <p>${dateFormatted[1]} ${dateFormatted[2]}, ${dateFormatted[3]}</p>
//                   </span>
//                 </div>
//               </div>`;
//           count[0]++;
//         }
//         else if (value['type'] == 'doing') {
//           doingData.push(value);
//           dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
//           doingRender += `<div class="item">
//               <div class="header-item">
//                 <div class="header-item-left">
//                   <a class="type-of-work">${value['category']}</a>
//                   <p class="title-of-work">${value['title']}</p>
//                 </div>
//                 <div class="header-item-right">
//                 <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer" onlick="showItemEdit(${value['id']})"></i>
//                 <i class="fa-solid fa-trash cursor-pointer" onclick="delItem(${value['id']})"></i>
//                 </div>
//               </div>
//               <div class="work-content">
//                 <p class="content">${value['content']}</p>
//                 <span class="time-line">
//                   <i class="fa-regular fa-clock"></i>
//                   <p>${dateFormatted[1]} ${dateFormatted[2]}, ${dateFormatted[3]}</p>
//                 </span>
//               </div>
//             </div>`;
//           count[1]++;
//         }
//         else {
//           finishedData.push(value);
//           dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
//           finishedRender += `<div class="item">
//               <div class="header-item">
//                 <div class="header-item-left">
//                   <a class="type-of-work">${value['category']}</a>
//                   <p class="title-of-work">${value['title']}</p>
//                 </div>
//                 <div class="header-item-right">
//                 <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer" onlick="showItemEdit(${value['id']})"></i>
//                 <i class="fa-solid fa-trash cursor-pointer" onclick="delItem(${value['id']})"></i>
//                 </div>
//               </div>
//               <div class="work-content">
//                 <p class="content">${value['content']}</p>
//                 <span class="time-line">
//                   <i class="fa-regular fa-clock"></i>
//                   <p>${dateFormatted[1]} ${dateFormatted[2]}, ${dateFormatted[3]}</p>
//                 </span>
//               </div>
//             </div>`;
//           count[2]++;
//         }
//       }
//       listItemTodo.innerHTML = todoRender;
//       quantityTodo.innerText = totoData.length;
//       listItemDoing.innerHTML = doingRender;
//       quantityDoing.innerText = doingData.length;
//       listItemFinished.innerHTML = finishedRender;
//       quantityFinished.innerText = finishedData.length;
//     })
// }
function renderfromApi() {
  getDataFromApi(renderTodoList, renderDoingList, renderFinishedList);
}
function render() {
  console.log("render");
  renderTodoList();
  renderDoingList();
  renderFinishedList();
}
function delItem(id) {
  delData(api, id, render);
}
// renderfromApi();
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