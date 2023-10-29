const addItemContainer = document.querySelectorAll(".add-item-container");
const plusBoard = document.querySelector(".plus-board");
const plusBtn = document.querySelector(".plus");
const boardContainer = document.querySelector("#board-container");

addItemContainer.forEach((container) => {
  const board = container.getAttribute("board");
  container.appendChild(createTaskElement(board));
});

const getClosestElement = (board, yAxis) => {
  const tasksInBoard = board.querySelectorAll(".task:not(.is-dragging)");

  let closestElement = null;
  let closestDistance = Number.NEGATIVE_INFINITY;
  tasksInBoard.forEach((task) => {
    const boundary = task.getBoundingClientRect();
    const top = boundary.top;
    const distance = yAxis - top;

    if (distance < 0 && distance > closestDistance) {
      closestDistance = distance;
      closestElement = task;
    }
  });
  return closestElement;
};

const triggerAddItemFunctionality = () => {
  const addItemButtons = document.querySelectorAll(".add-item");
  addItemButtons.forEach((elt) => {
    elt.addEventListener("click", () => {
      const board = getBoardAttribute(elt);
      if (board) {
        console.log("🚀 ~ file: kanban.js:51 ~ board:", board);
        document.querySelector(`.${board}-section`).style.display = "block";
        document.querySelector(`.${board}-input`).focus();
        elt.style.display = "none";
      }
    });
  });
};

triggerAddItemFunctionality();
setDraggableProperty();
setDragOverProperty();

const triggerCreateTaskBtn = () => {
  const createTaskBtn = document.querySelectorAll(".create-task-btn");
  createTaskBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const board = getBoardAttribute(btn);
      if (board) {
        const inputObject = document.querySelector(`.${board}-input`);
        const inputValue = inputObject.value;

        if (inputValue) {
          const newTask = createNewTask(inputValue);
          const tasksBoard = document.querySelector(`.${board}-tasks-board`);
          tasksBoard.appendChild(newTask);
          setDraggableProperty();

          inputObject.value = "";
          document.querySelector(`.${board}-section`).style.display = "none";
          document.querySelector(`.${board}-para`).style.display = "block";
        }
        setTaskCount();
      }
    });
  });
};

triggerCreateTaskBtn();

const setTaskCount = () => {
  const taskBoards = getAllTaskBoards();
  taskBoards.forEach((taskBoard) => {
    const totalTasksPerBoard = taskBoard.querySelectorAll(".task").length;
    const board = taskBoard.getAttribute("board");
    document.querySelector(`.${board}-count`).innerText = totalTasksPerBoard;
  });
};

setTaskCount();

const getAddBoardInputElement = () =>
  document.querySelector(".add-board-input");

plusBtn.addEventListener("click", () => {
  const holderDiv = addBoardDiv();
  plusBtn.innerText = "";
  plusBoard.appendChild(holderDiv);
  setaddBoardFunctionality();
  const addBoardInput = getAddBoardInputElement();
  addBoardInput.focus();
});

const setaddBoardFunctionality = () => {
  const addBoard = document.querySelector(".add-board");
  const addNewBoardDiv = document.querySelector(".add-new-board");
  const addBoardInput = getAddBoardInputElement();
  addBoard.addEventListener("click", () => {
    addNewBoardDiv.remove();
    plusBtn.innerText = "+";
    const boardName = addBoardInput.value;
    console.log(boardName);
    const newboard = createNewBoardElement(boardName);
    console.log(
      "🚀 ~ file: kanban.js:99 ~ newboard:",
      newboard,
      plusBoard,
      boardContainer
    );
    boardContainer.insertBefore(newboard, plusBoard);
    setDragOverProperty();
    triggerAddItemFunctionality();
    triggerCreateTaskBtn();
    setTaskCount();
  });
};
