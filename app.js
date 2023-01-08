// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.getElementById('grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement
let editFlag = false
let editID = ""


// ****** EVENT LISTENERS **********
//submit form
form.addEventListener('submit', addItem)
//clear forms
clearBtn.addEventListener('click', clearItems)
//load items
window.addEventListener('DOMContentLoaded', setupItems)
// ****** FUNCTIONS **********
function addItem(e){
  
  e.preventDefault()
  const value = grocery.value
  const id = new Date().getTime().toString()

  if(value && !editFlag ){
    const element = document.createElement('article')
  
    let attr = document.createAttribute('data-id') //create attribute in order to use .dataset.id
    attr.value = id
    element.setAttributeNode(attr)
    //add class
    element.classList.add('grocery-item')
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <!-- edit btn -->
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <!-- delete btn -->
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`
    const deleteBtn = element.querySelector('.delete-btn') //use element not document, important!
    const editBtn = element.querySelector('.edit-btn') //use element not document, important!
    deleteBtn.addEventListener('click', deleteItem)
    editBtn.addEventListener('click', editItem)
    list.appendChild(element)
    //display alert
    displayAlert('item added to the list', 'success')
    container.classList.add('show-container')
      //add to local storage
    addToLocalStorage(id, value)
    //set back to default
    setBackToDefault
  } else if(value && editFlag ){ //editFlag would only be true if we click the edit button
    console.log('editing')
    editElement.innerHTML = value
    displayAlert('value changed', 'success')
    //edit local storage
    editLocalStorage(editID, value)
    setBackToDefault()
  } else{
    displayAlert('please enter value', 'danger')
  }
}

function displayAlert(text, action){
  alert.textContent = text;
  alert.classList.add(`alert-${action}`)
  //remove alert
  setTimeout(function(){
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`)
  }, 1000)
}
//clear items
function clearItems(){
  const items = document.querySelectorAll('.grocery-item')
  if(items.length > 0){
    items.forEach(function(item){
      list.removeChild(item)
    })
  }
  container.classList.remove('show-container')
  displayAlert('empty list', 'danger')
  setBackToDefault() // otherwise it will leave the last added-in text in the form
  localStorage.removeItem('list')
}

//edit function
function editItem(e){
  const element= e.currentTarget.parentElement.parentElement
  //set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling //assign editElement
  //set form value
  grocery.value = editElement.innerHTML
  editFlag = true
  editID = element.dataset.id
  submitBtn.textContent = 'edit'
}
//delete function
function deleteItem(e){
  const element= e.currentTarget.parentElement.parentElement //select the right element
  const id = element.dataset.id
  list.removeChild(element)
  if(list.children.length === 0){
    container.classList.remove('show-container')
  }
  displayAlert('item removed', 'danger')
  setBackToDefault();

  //remove from local storage
  removeFromLocalStorage(id)

}
//set back to default
function setBackToDefault(){
  grocery.value = ''
  editFlag = false
  editID = ''
  submitBtn.textContent = 'submit'
  // console.log('set back to default')
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value){
  // console.log('added to local storage')
  const grocery = {id, value}
  let items = getLocalStorage()
  items.push(grocery)
  localStorage.setItem('list', JSON.stringify(items))
  // console.log('grocery')
}

function getLocalStorage(){
  return localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):[]
}

function removeFromLocalStorage(id){
  let items = getLocalStorage()
  items = items.filter(function(item){
    if(item.id !== id){
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
  console.log('list')
}

function editLocalStorage(id, value){
 let items = getLocalStorage()
 items = items.map(function(item){
   if(item.id === id){
     item.value = value
   }
   return item
 })
 localStorage.setItem('list', JSON.stringify(items))
}

//localStorage API
//setItem
//getItem
//removeItem
//save as strings

// localStorage.setItem(`orange`, JSON.stringify(['item', 'item2']))
// const oranges = JSON.parse(localStorage.getItem(`orange`))
// console.log(oranges)
// localStorage.removeItem('orange')
// ****** SETUP ITEMS **********
//when refresh the page, those previous added and edits are still there 
function setupItems(){
  let items = getLocalStorage()
  if(items.length > 0){
    items.forEach(function(item){
      createListItem(item.id, item.value)
    })
    container.classList.add('show-container')
  }
}

function createListItem(id, value){
  const element = document.createElement('article')
  
  //add id
  let attr = document.createAttribute('data-id') //create attribute in order to use .dataset.id
  attr.value = id
  element.setAttributeNode(attr)
  //add class
  element.classList.add('grocery-item')
  element.innerHTML = `<p class="title">${value}</p>
  <div class="btn-container">
    <!-- edit btn -->
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <!-- delete btn -->
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`
const deleteBtn = element.querySelector('.delete-btn') //use element not document, important!
const editBtn = element.querySelector('.edit-btn') //use element not document, important!
deleteBtn.addEventListener('click', deleteItem)
editBtn.addEventListener('click', editItem)
  list.appendChild(element)
}