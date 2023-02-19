const btnAdd = document.querySelector(".btn-add");
const btnEdit = document.querySelectorAll(".js-button-edit")
const formAdd = document.querySelector(".form-add-container");
const formEdit = document.querySelector(".form-edit-container");
const listItemTodo = document.querySelector(".list-item-todo");
btnAdd.addEventListener("click", () => {
    formAdd.setAttribute("style", "display: flex");
});
for(const value of btnEdit) {
    value.addEventListener("click", () => {
        formEdit.setAttribute("style", "display: flex");
    });
}
const btnCloseForm = document.querySelectorAll(".js-btn-close-form");
for(const value of btnCloseForm) {
    value.addEventListener("click", () => {
        formAdd.setAttribute("style", "display: none");
        formEdit.setAttribute("style", "display: none");
    })
}
const api = 'https://63ef9af7c59531ccf1733da9.mockapi.io/todo/tasks';
async function getData(url = '') {
    const response = await fetch(url, {
      method: 'GET',
    });
    return response.json();
  }

function render() {
    getData(api)
    .then(data => {
        let todoRender = '';
        let doingRender = '';
        let finishedRender = '';
        let dateFormatted;
        for(const value of data) {
            if(value['type'] == 'todo') {
                dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
                todoRender += `<div class="item">
                <div class="header-item">
                  <div class="header-item-left">
                    <a class="type-of-work">${value['category']}</a>
                    <p class="title-of-work">${value['title']}</p>
                  </div>
                  <div class="header-item-right">
                    <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer"></i>
                    <i class="fa-solid fa-trash cursor-pointer"></i>
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
            else if(value['type'] == 'doing') {
              dateFormatted = new Date(value['createdAt']).toDateString().split(' ');
              doingRender += `<div class="item">
              <div class="header-item">
                <div class="header-item-left">
                  <a class="type-of-work">${value['category']}</a>
                  <p class="title-of-work">${value['title']}</p>
                </div>
                <div class="header-item-right">
                  <i class="fa-regular fa-pen-to-square js-button-edit cursor-pointer"></i>
                  <i class="fa-solid fa-trash cursor-pointer"></i>
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
            else {
                finishedList.push(value);
            }
        }
        listItemTodo.innerHTML = todoHtml;

    })
}
render();
