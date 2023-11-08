const getAllTasks = () => document.querySelectorAll(".task");

/* Setting drag start and drag end property for all tasks */
const setDragListener = (task) => {
  task.addEventListener("dragstart", (e) => {
    task.classList.add("is-dragging");
  });

  task.addEventListener("dragend", (e) => {
    task.classList.remove("is-dragging");
  });
};

const getParentAndSiblings = (element) => {
  const parent = element.parentElement;
  const siblings = Array.from(parent.children);
  return [parent.parentElement, siblings];
};

const lockClickHandler = (element) => {
  element.addEventListener("click", () => {
    const [grandParent, siblings] = getParentAndSiblings(element);
    grandParent.setAttribute("draggable", "true");
    const lockIconIndex = siblings.indexOf(element);
    const unlockIconIndex = lockIconIndex + 1;
    element.style.display = "none";
    siblings[unlockIconIndex].style.display = "block";
  });
};

const unlockClickHandler = (element) => {
  element.addEventListener("click", () => {
    const [grandParent, siblings] = getParentAndSiblings(element);
    grandParent.setAttribute("draggable", "false");
    const unlockIconIndex = siblings.indexOf(element);
    const lockIconIndex = unlockIconIndex - 1;
    element.style.display = "none";
    siblings[lockIconIndex].style.display = "block";
  });
};

const getTargetBoardIndex = (boardElt, taskId) => {
  let curBoardTaskIndex = 0;
  let found = false;
  for (let key = 0; key < boardElt.childNodes.length; key++) {
    console.log(
      "🚀 ~ board.addEventListener ~ key:",
      key,
      taskId,
      boardElt.childNodes[key].getAttribute("id")
    );
    let tempId = boardElt.childNodes[key].getAttribute("id");
    if (taskId === tempId) {
      curBoardTaskIndex = key;
      console.log(
        "🚀 ~ file: utils.js:103 ~ board.addEventListener ~ curBoardTaskIndex:",
        curBoardTaskIndex
      );
      found = true;
    }

    if (found) {
      break;
    }
  }

  return curBoardTaskIndex;
};

/* Setting drag over property for new boards which is created */
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
      console.log(storage);
      console.log("🚀 ~ file ~ id:", taskId);

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
        console.log("🚀 ~ file: utils.js:76 ", boardElt.childNodes);

        const curBoardTaskIndex = getTargetBoardIndex(boardElt, taskId);
        console.log("🚀 ~ utils.js:92 ~ curBoardTaskIndex:", curBoardTaskIndex);

        storage[curBoard].splice(curBoardTaskIndex, 0, elementObject);
        console.log("🚀 ~ file: utils.js:115 ~ storage:", storage);
        setLocalStorage("tasksList", storage);
      }
    }

    console.log("🚀 ~ file: utils.js:38 ~ curBoard:", curBoard);
  });
};

const getLocalStorage = (variable) => localStorage.getItem(variable);

const setLocalStorage = (variable, value) =>
  localStorage.setItem(variable, JSON.stringify(value));

const getAddBoardInputElement = () =>
  document.querySelector(".add-board-input");

const setBoardAttributeToElement = (element, board) =>
  element.setAttribute("board", board);

const createDiv = (className = "", id = "") => {
  const div = document.createElement("div");
  div.className = className;
  if (id) {
    div.id = id;
  }
  return div;
};

const createParagraph = (className = "") => {
  const para = document.createElement("p");
  para.className = className;
  return para;
};

const createInputField = (className = "", placeHolder = "", type) => {
  const input = document.createElement("input");
  input.className = className;
  input.setAttribute("placeholder", placeHolder);
  input.type = type;
  return input;
};

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

const getBoardAttribute = (element) => element.getAttribute("board");

const getAllTaskBoards = () => document.querySelectorAll(".tasks-board");

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
  lockClickHandler(lockIcon);
  unlockClickHandler(unlockIcon);

  return innerElt;
};

const createNewTask = (taskName = "No-Title", isDraggable = true, id) => {
  const elt = createDiv("task", id);
  elt.setAttribute("draggable", isDraggable ? "true" : "false");
  elt.innerText = taskName;
  setDragListener(elt);
  const innerElt = createIconsDiv(isDraggable);
  elt.appendChild(innerElt);
  // console.log("trigger completed");
  return elt;
};

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

// Create new board
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
