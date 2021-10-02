const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelector(".card-body");
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners(); // tum listenerlar bunun icinde olucak ve fonk cagrıldıgı ıcın tum eventlistenerler eklenmis olucak

function eventListeners(){
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    clearButton.addEventListener("click",deleteAllTodos);
    filter.addEventListener("keyup",filterTodos);
}
function filterTodos(e){
    //e.target.value bize input alanının icerigini vericek
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        console.log(text.indexOf(filterValue));
        if(text.indexOf(filterValue) === -1){
            listItem.setAttribute("style","display : none !important");
        }else {
            listItem.setAttribute("style","display : flex !important");
        }
    });
}
function loadAllTodosToUI(e){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    });
}
function addTodo(e){ // todo ekleyin butonuna tıklanmıs ıse
    const newTodo = todoInput.value.trim();
    if(newTodo === ""){
        //todo inputu bos
         showAlert("danger","Input Alanı Boş Bırakılamaz");
    }else{
        let todos = getTodosFromStorage();
        if(!todos.includes(newTodo)){ // eger ki to do zaten var ise tekrar eklenmeyecek
            addTodoToUI(newTodo);
            addTodoToStorage(newTodo);
            showAlert("success","Todo Başarıyla Eklendi");
            todoInput.value = "";//eleman ekledıkten sonra icerigini temizlemek icin
        }else{
            showAlert("warning","To Do Zaten Listenizde Bulunmaktadır");
        }
    }
    e.preventDefault();
}
function addTodoToUI(newTodo){
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";

    const text = document.createTextNode(newTodo);

    const link = document.createElement("a");
    link.className = "delete-item";
    link.href = "#";

    const icon = document.createElement("i");
    icon.className = "fa fa-remove";

    link.appendChild(icon);
    listItem.appendChild(text);
    listItem.appendChild(link);

    todoList.appendChild(listItem);
}
function getTodosFromStorage(){
    let todos;
    if(localStorage.getItem("todos") === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}
function addTodoToStorage(newtodo){
    let todos = getTodosFromStorage();
    todos.push(newtodo);
    localStorage.setItem("todos",JSON.stringify(todos));
}
function showAlert(type,message){
    if(firstCardBody.childElementCount === 3){
        firstCardBody.lastChild.remove();
    }
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);
    //set kullanıcaksak remove yukarıda yapma zaten burada sıleceksın ama bug oluyor o zaman dılımınde butona basınca
    //2 parametre alır : bu satıra geldiginde kac ms sonra fonksiyon BİR kere calıssın ve ne yapsın
    //bu sekilde yapabılırız ama UX acısından 1 sn dolmadan tekrar butona basınca birden fazla alert olusuyor
    // setTimeout(function(){
    //     alert.remove();
    // },1000);
}
function deleteTodo(e){
    if(e.target.className === "fa fa-remove"){// x ya basılmıs ıse second card body uzerınde
        //UI remove
        const liToBeRemoved = e.target.parentElement.parentElement;
        liToBeRemoved.remove();
        //storage remove
        removeTodoFromStorage(liToBeRemoved.textContent); //icerikten anlıcaz hangisini silcegimizi
        showAlert("success","To Do Başarıyla Silindi");
    }
}
function removeTodoFromStorage(textContent){ // icerikten anlayacagız hangi indexi silmemiz gerektigini
    let todos = getTodosFromStorage();
    todos.splice(todos.indexOf(textContent), 1);
    localStorage.setItem("todos",JSON.stringify(todos));
}
function deleteAllTodos(){
     if(confirm("Tüm To Do'ları silmek istediğinizden emin misiniz?")){
         //UI remove
       //todoList.innerHTML = ""; //yavas
       while(todoList.firstElementChild != null){
           todoList.firstElementChild.remove();
       }
      //storage Remove
      localStorage.removeItem("todos");
      showAlert("success","Tüm Todo lar Temizlendi");
     }
    
}


