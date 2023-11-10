/**
 * This function is used to return al the task in the document
 * @returns HTML elements
 */
const getAllTasks = () => document.querySelectorAll(".task");

/**
 * This function is use to set drag start and drag end property for all tasks
 * @param {HTMLElement} task The element in which the handler should add 
 */
const setDragListener = (task) => {
  task.addEventListener("dragstart", (e) => {
    task.classList.add("is-dragging");
  });

  task.addEventListener("dragend", (e) => {
    task.classList.remove("is-dragging");
  });
};

/**
 * This function is used to return the parent and all the siblings of the element
 * @param {HTMLElement} element 
 * @returns HTML element
 */
const getParentAndSiblings = (element) => {
  const parent = element.parentElement;
  const siblings = Array.from(parent.children);
  return [parent.parentElement, siblings];
};

/**
 * This function is to unlock the task from dragging.
 * @param {HTMLElement} element The element in which we have to set the click handler
 */
const unLockClickHandler = (element) => {
  element.addEventListener("click", () => {
    const [grandParent, siblings] = getParentAndSiblings(element);
    grandParent.setAttribute("draggable", "true");
    const lockIconIndex = siblings.indexOf(element);
    const unlockIconIndex = lockIconIndex + 1;
    element.style.display = "none";
    siblings[unlockIconIndex].style.display = "block";
  });
};

/**
 * This function is to lock the task from dragging.
 * @param {HTMLElement} element The element in which we have to set the click handler
 */
const lockClickHandler = (element) => {
  element.addEventListener("click", () => {
    const [grandParent, siblings] = getParentAndSiblings(element);
    grandParent.setAttribute("draggable", "false");
    const unlockIconIndex = siblings.indexOf(element);
    const lockIconIndex = unlockIconIndex - 1;
    element.style.display = "none";
    siblings[lockIconIndex].style.display = "block";
  });
};

/**
 * This function is used to get the index of the task 
 * to which we can push the object of the dragged task
 * @param {HTMLElement} boardElt 
 * @param {string} taskId  This field will help to identify which task it is.
 * @returns Integer
 */
const getTargetBoardIndex = (boardElt, taskId) => {
  let curBoardTaskIndex = 0;
  let found = false;
  for (let key = 0; key < boardElt.childNodes.length; key++) {
    let tempId = boardElt.childNodes[key].getAttribute("id");
    if (taskId === tempId) {
      curBoardTaskIndex = key;
      found = true;
    }
    if (found) {
      break;
    }
  }

  return curBoardTaskIndex;
};

/**
 * This function is used to set the dragover functionality
 * @param {HTMLElement} board The html element in which we have to set the dragover listener
 */
const setDragOverHandler = (board) => {
  board.addEventListener("dragover", (e) => {
    e.preventDefault();
    const taskDragged = document.querySelector(".is-dragging");
    const closestElt = getClosestElement(board, e.clientY);
    if (closestElt) {
      board.insertBefore(taskDragged, closestElt);
    } else {
      board.appendChild(taskDragged);
    }
    setTaskCount();
  });

  board.addEventListener("drop", (e) => {
    const curBoard = getBoardAttribute(board);

    /* set the local variable here */
    const taskId = e.target.id;
    const className = e.target.className;
    console.log(e);
    if (className.includes("is-dragging")) {
      const storage = JSON.parse(getLocalStorage("tasksList"));
      // console.log(storage);
      // console.log("🚀 ~ file ~ id:", taskId);

      let elementObject;
      let idExists = false;
      for (let tempBoard in storage) {
        console.log(storage[tempBoard]);
        for (let taskIndex in storage[tempBoard]) {
          console.log(storage[tempBoard][taskIndex].id, taskId);
          if (storage[tempBoard][taskIndex].id === taskId) {
            idExists = true;
            elementObject = storage[tempBoard][taskIndex];
            storage[tempBoard].splice(taskIndex, 1);
          }
        }
      }

      console.log("🚀 ~ utils.js:101 ~ elementObject:", elementObject);

      if (idExists) {
        const boardElt = document.querySelector(`.${curBoard}-tasks-board`);
        // console.log("🚀 ~ file: utils.js:76 ", boardElt.childNodes);

        const curBoardTaskIndex = getTargetBoardIndex(boardElt, taskId);
        // console.log("🚀 ~ utils.js:92 ~ curBoardTaskIndex:", curBoardTaskIndex);

        storage[curBoard].splice(curBoardTaskIndex, 0, elementObject);
        // console.log("🚀 ~ file: utils.js:115 ~ storage:", storage);
        setLocalStorage("tasksList", storage);
      }
    }

    console.log("🚀 ~ file: utils.js:38 ~ curBoard:", curBoard);
  });
};

/**
 * This function is used to get the item from localstorage
 * @param {string} variable This field is the key which helps to fetch the value in localstorag
 * @returns Object
 */
const getLocalStorage = (variable) => localStorage.getItem(variable);

/**
 * This function is used to set value in the local storage
 * @param {string} variable This field acts as the key of the localstorage
 * @param {object} value This field acts as the object
 * @returns 
 */
const setLocalStorage = (variable, value) =>
  localStorage.setItem(variable, JSON.stringify(value));

/**
 * This function is used to fetch all the elements which has class as "add-board-input"
 * @returns HTML element
 */
const getAddBoardInputElement = () =>
  document.querySelector(".add-board-input");

/**
 * This function is used to set the board attribute for the element
 * @param {HTMLElement} element This element is where we have to set the board attribute
 * @param {string} board This field is used to set the value of the board attribute
 * @returns HTML element
 */
const setBoardAttributeToElement = (element, board) =>
  element.setAttribute("board", board);

/**
 * This function is used to create a div element
 * @param {string} className This field is acts as the class name of the div
 * @param {string} id This field is acts as the class name of the div
 * @returns HTML element
 */
const createDiv = (className = "", id = "") => {
  const div = document.createElement("div");
  div.className = className;
  if (id) {
    div.id = id;
  }
  return div;
};

/**
 * This function is used to create a paragraph element
 * @param {string} className This field is acts as the class name of the paragraph
 * @returns HTML element
 */
const createParagraph = (className = "") => {
  const para = document.createElement("p");
  para.className = className;
  return para;
};

/**
 * This function is used to create a input field
 * @param {string} className This field is acts as the class name
 * @param {string} placeHolder This field acts as the placeholder text for the inpout field
 * @param {string} type This field is used to specify the type of the input field
 * @returns HTML element
 */
const createInputField = (className = "", placeHolder = "", type) => {
  const input = document.createElement("input");
  input.className = className;
  input.setAttribute("placeholder", placeHolder);
  input.type = type;
  return input;
};

/**
 * This function is used to return the HTML element which has the ability to show the field
 * which help to add task in each board.
 * @param {string} board This field is to assign the value for the class
 * @returns HTML element (add-item <board-name>-para)
 */
const createTaskElement = (board) => {
  const strong = document.createElement("strong");
  strong.innerText = "+";
  const elt = createParagraph(`add-item ${board}-para`);
  setBoardAttributeToElement(elt, board);
  elt.appendChild(strong);
  elt.innerHTML += "Add Task";
  addTaskHandler(elt);
  return elt;
};

/**
 * This function is used to get the board value of a particular element
 * @param {HTMLElement} Element This is an  element from which we need to get the board value
 * @returns String
 */
const getBoardAttribute = (element) => element.getAttribute("board");

/**
 * This function is used to return all the available task boards
 * @returns HTML element
 */
const getAllTaskBoards = () => document.querySelectorAll(".tasks-board");

/**
 * This function is used to set he lock/unlock icon in each task.
 * This also triggers the click handler for lock/unlock functionality
 * @param {boolean} isDraggable This field is used to make the toggle between the lock/unlock icon
 * @returns HTML element (task-icon)
 */
const createIconsDiv = (isDraggable) => {
  const innerElt = createDiv("task-icon");
  const lockIcon = document.createElement("i");
  lockIcon.className = "fa-solid fa-lock fa-lg lock-icon";

  const unlockIcon = document.createElement("i");
  unlockIcon.className = "fa-solid fa-unlock fa-lg unlock-icon";

  if (isDraggable) {
    lockIcon.style.display = "none";
    unlockIcon.style.display = "block";
  } else {
    lockIcon.style.display = "block";
    unlockIcon.style.display = "none";
  }

  innerElt.appendChild(lockIcon);
  innerElt.appendChild(unlockIcon);
  unLockClickHandler(lockIcon);
  lockClickHandler(unlockIcon);

  return innerElt;
};

/**
 * This function is used to create a new task div which is draggable by default
 * @param {string} taskName This field will the task name of that div
 * @param {boolean} isDraggable This filed will help to make the task draggable but by default,
 *                                it is true
 * @param {string} id This field is to provide the id for the task div
 * @returns HTML element (task)
 */
const createNewTask = (taskName = "No-Title", isDraggable = true, id) => {
  const elt = createDiv("task", id);
  elt.setAttribute("draggable", isDraggable ? "true" : "false");
  elt.innerText = taskName;
  setDragListener(elt);
  const innerElt = createIconsDiv(isDraggable);
  elt.appendChild(innerElt);
  return elt;
};

/**
 * this function is used to create a container in which we can type the new board name and 
 * a button to submit.   
 * @returns - HTML element (add-new-board)
 */
const addBoardDiv = () => {
  const holder = createDiv("add-new-board");
  const inputElement = createInputField(
    "add-board-input",
    "Enter Board name",
    "text"
  );
  const buttonElement = document.createElement("button");
  buttonElement.innerText = "Add";
  buttonElement.className = "add-board";
  holder.appendChild(inputElement);
  holder.appendChild(buttonElement);
  return holder;
};

/**
 * This function is used to add the board object in the local storage.
 * @param {*} boardName - The parameter is used as a value in a title in an object 
 *                        of the boardList in local storage.
 */
const addBoardToLocalStorage = (boardName) => {
  const boardList = JSON.parse(getLocalStorage("boardList"));
  const tasksList = JSON.parse(getLocalStorage("tasksList"));
  if (boardList) {
    let newBoardData = {
      title: boardName,
      description: "Newly created board",
    };
    boardList.push(newBoardData);
  }

  console.log(
    "🚀 ~ file: utils.js:241 ~ addBoardToLocalStorage ~ tasksList:",
    tasksList
  );
  if (tasksList) {
    tasksList[boardName] = [];
    console.log("🚀 ~ file: utils.js:245 ~ newBoard:", tasksList);
    setLocalStorage("tasksList", tasksList);
  }

  setLocalStorage("boardList", boardList);
};

/**
 * This function is used to create a new board div 
 * @param {string} boardName - The parameter will be the board name in the UI and the
 *                            class for that div will be assigned using this name.
 * @returns - HTML element (board <board-name>)
 */
const createNewBoardElement = (boardName) => {
  const boardTitle = boardName.toLowerCase().trim();
  const mainBoardDiv = createDiv(`board ${boardTitle}`);

  const headingDiv = createDiv("heading");
  const headDiv = createDiv("head");
  const circleDiv = createDiv("circle");
  const titlePara = createParagraph("title");
  titlePara.innerText = boardTitle[0].toUpperCase() + boardTitle.slice(1);
  headDiv.appendChild(circleDiv);
  headDiv.appendChild(titlePara);

  const counterPara = createParagraph(`counter ${boardTitle}-count`);

  headingDiv.appendChild(headDiv);
  headingDiv.appendChild(counterPara);

  mainBoardDiv.appendChild(headingDiv);
  // console.log("mainBoardDiv = ", mainBoardDiv);

  const tasksBoardDiv = createDiv(`tasks-board ${boardTitle}-tasks-board`);
  setDragOverHandler(tasksBoardDiv);
  setBoardAttributeToElement(tasksBoardDiv, boardTitle);

  mainBoardDiv.appendChild(tasksBoardDiv);

  const addItemContainerDiv = createDiv("add-item-container");
  setBoardAttributeToElement(addItemContainerDiv, boardTitle);

  const inputSectionDiv = createDiv(`input-section ${boardTitle}-section`);
  const inputField = createInputField(
    `input-field ${boardTitle}-input`,
    "Start typing to create an draft item",
    "text"
  );
  setBoardAttributeToElement(inputField, boardTitle);

  const buttonElement = document.createElement("button");
  buttonElement.innerText = "+";
  buttonElement.className = "create-task-btn";
  triggerCreateTaskBtn(buttonElement);
  setBoardAttributeToElement(buttonElement, boardTitle);

  inputSectionDiv.appendChild(inputField);
  inputSectionDiv.appendChild(buttonElement);

  addItemContainerDiv.appendChild(inputSectionDiv);

  const addItemPara = createTaskElement(boardTitle);
  addItemContainerDiv.appendChild(addItemPara);

  mainBoardDiv.appendChild(addItemContainerDiv);

  return mainBoardDiv;
};
