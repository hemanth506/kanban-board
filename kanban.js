const addItemContainer = document.querySelectorAll(".add-item-container");
const plusBoard = document.querySelector(".plus-board");
const plusBtn = document.querySelector(".plus");
const boardContainer = document.querySelector("#board-container");
const saveFilterBtn = document.querySelector(".save-filter");

addItemContainer.forEach((container) => {
  const board = container.getAttribute("board");
  container.appendChild(createTaskElement(board));
});

saveFilterBtn.addEventListener("click", () => {
  const allTasks = getAllTasks();
  console.log("🚀", allTasks.length);
  const filterInput = document
    .querySelector(".input-filter")
    .value.toLowerCase();
  console.log(`"${filterInput}"`);
  allTasks.forEach((task) => {
    const innerText = task.innerText.toLowerCase();
    if (innerText.includes(filterInput)) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
  setTaskCount();
});

/**
 *  This element is used to get the closest task of the dragged element
 * @param {HTMLElement} board The element from which we have to 
 *                         find the task which is not dragging
 * @param {number} yAxis
 * @returns HTML element
 */
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

/**
 * This function is used to trigger add item functionality
 * @param {HTMLElement} elt 
 */
const addTaskHandler = (elt) => {
  elt.addEventListener("click", () => {
    const board = getBoardAttribute(elt);
    if (board) {
      console.log("🚀 ~ file: kanban.js:51 ~ board:", board);
      document.querySelector(`.${board}-section`).style.display = "block";
      document.querySelector(`.${board}-input`).focus();
      elt.style.display = "none";
    }
  });
};

/**
 * This function will trigger the create task button
 * and add the task in local storage.
 * @param {HTMLElement} btn
 */
const triggerCreateTaskBtn = (btn) => {
  btn.addEventListener("click", () => {
    const board = getBoardAttribute(btn);
    if (board) {
      const inputObject = document.querySelector(`.${board}-input`);
      const inputValue = inputObject.value;

      if (inputValue) {
        const id = Math.random().toString().split(".")[1];
        const newTask = createNewTask(inputValue, true, id);
        const tasksBoard = document.querySelector(`.${board}-tasks-board`);
        tasksBoard.appendChild(newTask);

        const taskObject = {
          taskName: inputValue,
          id,
          isDraggable: true,
        };

        const tasksList = JSON.parse(getLocalStorage("tasksList"));
        tasksList[board].push(taskObject);
        setLocalStorage("tasksList", tasksList);

        inputObject.value = "";
        document.querySelector(`.${board}-section`).style.display = "none";
        document.querySelector(`.${board}-para`).style.display = "block";
      }
      setTaskCount();
    }
  });
};

/**
 * This function is used to set the task count for each board
 */
const setTaskCount = () => {
  const taskBoards = getAllTaskBoards();
  taskBoards.forEach((taskBoard) => {
    const tasksPerBoard = taskBoard.querySelectorAll(".task");
    let totalTasksLength = tasksPerBoard.length;
    tasksPerBoard.forEach((task) => {
      const computedStyle = window.getComputedStyle(task);
      if (computedStyle.getPropertyValue("display") === "none") {
        totalTasksLength--;
      }
    });

    const board = taskBoard.getAttribute("board");
    document.querySelector(`.${board}-count`).innerText = totalTasksLength;
  });
};

plusBtn.addEventListener("click", () => {
  const holderDiv = addBoardDiv();
  plusBtn.innerText = "";
  plusBoard.appendChild(holderDiv);
  setAddBoardFunctionality();
  const addBoardInput = getAddBoardInputElement();
  addBoardInput.focus();
});

/**
 *  this function is to trigger the all board functionality
 */
const setAddBoardFunctionality = () => {
  const addBoard = document.querySelector(".add-board");
  const addNewBoardDiv = document.querySelector(".add-new-board");
  const addBoardInput = getAddBoardInputElement();
  addBoard.addEventListener("click", () => {
    addNewBoardDiv.remove(); // remove add button and replace with input field and add button
    plusBtn.innerText = "+";
    const boardName = addBoardInput.value.toLowerCase();
    console.log("boardName = " + boardName);
    if (boardName) {
      const newboard = createNewBoardElement(boardName);
      boardContainer.insertBefore(newboard, plusBoard);
      addBoardToLocalStorage(boardName);
      setTaskCount();
    }
  });
};

/**
 * The below code is uded to render the boards from local storage
 */
const boardList = getLocalStorage("boardList");
let defaultboards = [];
if (!boardList) {
  defaultboards = [
    {
      title: "todo",
      description: "work to start",
    },
    {
      title: "inprogress",
      description: "work in progress",
    },
    {
      title: "done",
      description: "work completed",
    },
  ];
  setLocalStorage("boardList", defaultboards);
} else {
  defaultboards = JSON.parse(boardList);
}

defaultboards.forEach((board) => {
  const newBoard = createNewBoardElement(board.title);
  boardContainer.insertBefore(newBoard, plusBoard);
});

/**
 * The below code is used to render the tasks from local storage
 */
const taskList = getLocalStorage("tasksList");
let existingTasksPerBoard = {};
if (taskList) {
  existingTasksPerBoard = JSON.parse(taskList);
} else {
  existingTasksPerBoard = {
    todo: [],
    inprogress: [],
    done: [],
  };
  setLocalStorage("tasksList", existingTasksPerBoard);
}

for (let board in existingTasksPerBoard) {
  let N = existingTasksPerBoard[board].length;
  for (let i = 0; i < N; i++) {
    const currentBoardTasks = existingTasksPerBoard[board];
    // console.log(currentBoardTasks[i].board)
    const newTask = createNewTask(
      currentBoardTasks[i].taskName,
      currentBoardTasks[i].isDraggable,
      currentBoardTasks[i].id
    );
    const tasksBoard = document.querySelector(`.${board}-tasks-board`);
    tasksBoard.appendChild(newTask);
  }
}

setTaskCount();
