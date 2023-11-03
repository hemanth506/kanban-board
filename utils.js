const getAllTasks = () => document.querySelectorAll(".task");

/* Setting drag start and drag end property for all tasks */
const setDraggableProperty = () => {
  const tasks = getAllTasks();
  tasks.forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      task.classList.add("is-dragging");
    });

    task.addEventListener("dragend", (e) => {
      task.classList.remove("is-dragging");
    });
  });
};

/* Setting drag over property for all boards and for new boards which is created */
const setDragOverProperty = () => {
  const taskBoards = getAllTaskBoards();
  taskBoards.forEach((board) => {
    board.addEventListener("dragover", (e) => {
      e.preventDefault();
      const taskDragged = document.querySelector(".is-dragging");
      const closestElt = getClosestElement(board, e.clientY);
      // const curBoard = getBoardAttribute(board);
      // console.log("🚀 ~ file: utils.js:27 ~ curBoard:", curBoard)
      if (closestElt) {
        board.insertBefore(taskDragged, closestElt);
      } else {
        board.appendChild(taskDragged);
      }
      setTaskCount();
    });
  });

  taskBoards.forEach((board) => {
    board.addEventListener("drop", (e) => {
      const curBoard = getBoardAttribute(board);
      console.log(e)
      console.log("🚀 ~ file: utils.js:38 ~ curBoard:", curBoard);
    });
  });
};

const getLocalStorage = (variable) => localStorage.getItem(variable);

const setLocalStorage = (variable, value) =>
  localStorage.setItem(variable, JSON.stringify(value));

const getAddBoardInputElement = () =>
  document.querySelector(".add-board-input");

const setBoardAttributeToElement = (element, board) =>
  element.setAttribute("board", board);

const createDiv = (className = "") => {
  const div = document.createElement("div");
  div.className = className;
  return div;
};

const createParagraph = (className = "") => {
  const para = document.createElement("p");
  para.className = className;
  para.id = Date.now();
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
  elt.innerHTML += "Add Item";
  return elt;
};

const getBoardAttribute = (element) => element.getAttribute("board");

const getAllTaskBoards = () => document.querySelectorAll(".tasks-board");

const createNewTask = (taskName = "No-Title") => {
  const elt = createParagraph("task");
  elt.setAttribute("draggable", "true");
  elt.innerText = taskName;
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
  if (boardList) {
    let newBoardData = {
      title: boardName,
      description: "Newly created board",
    };
    boardList.push(newBoardData);
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
  console.log("mainBoardDiv = ", mainBoardDiv);

  const tasksBoardDiv = createDiv(`tasks-board ${boardTitle}-tasks-board`);
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
  setBoardAttributeToElement(buttonElement, boardTitle);

  inputSectionDiv.appendChild(inputField);
  inputSectionDiv.appendChild(buttonElement);

  addItemContainerDiv.appendChild(inputSectionDiv);

  const addItemPara = createTaskElement(boardTitle);
  addItemContainerDiv.appendChild(addItemPara);

  mainBoardDiv.appendChild(addItemContainerDiv);

  return mainBoardDiv;
};
