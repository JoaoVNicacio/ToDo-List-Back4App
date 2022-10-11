Parse.serverURL = "https://parseapi.back4app.com"; // This is your Server URL
// Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
Parse.initialize(
  "YCjuv4RcnxdzcbkSJdNlWH3Swj0f1xL3AesmjfhB", // This is your Application ID
  "ADVEL2vVyNA93gurMA5eAiQ2ojRco8qJam52YWVl" // This is your Javascript key
);

const Tasks = Parse.Object.extend("Tasks");

const taskList = document.getElementById("task-list");
const inputDescription = document.getElementById("inputDescription");
const btInsert = document.getElementById("btInsert");


const loadTasks = async () => {
  const query = new Parse.Query(Tasks);
  let counter = 0;

  try {
    const results = await query.find();
    taskList.innerHTML = "";

    for (const task of results) {

      const taskDescription = task.get("taskDescription");
      const done = task.get("done");
      const aps = "'";
      const status = done ? 'Feita' : 'A fazer'
      const style = done ? 'done' : 'to-do'

      taskList.innerHTML += `<li class="${style}">${taskDescription} - ${status} <button onclick="handleClickBtStatusChange(${aps}${task.id}${aps})">Mudar Status</button> <button onclick ="handleClickBtRemove(${aps}${task.id}${aps})">Remover</button></li>`;

    }

  } catch (error) {
    console.error("Error while fetching Tasks", error);
  }

};

const addTask = async () => {
  const description = inputDescription.value.trim();

  if (!description) {
    alert("Insira uma descrição!");
    return;
  }

  const task = new Parse.Object("Tasks");
  task.set("taskDescription", description);
  task.set("done", false);

  try {
    const result = await task.save();
    console.log("Task created", result.id);

  } catch (error) {
    console.error("Error while creating Tarefa: ", error);
  }

  inputDescription.value = "";
  inputDescription.focus();
  loadTasks();
};

const handleClickBtRemove = async (id) => {

  const query = new Parse.Query(Tasks);

  try {
    const task = await query.get(id);

    if (!task) {
      alert("Nenhuma tarefa encontrada!");
      return;
    }

    const response = await task.destroy();
    console.log("Deleted ParseObject", response);

    loadTasks();
    alert("Tarefa excluída");

  } catch (error) {
    console.error("Error while fetching Tasks", error);

  }
};

const handleClickBtStatusChange = async (id) => {

  const query = new Parse.Query(Tasks);

  try {
    const task = await query.get(id);

    if (!task) {
      alert("Nenhuma tarefa encontrada!");
      return;
    }

    const isDone = task.get("done")
    task.set("done", !isDone);
    task.save();
    loadTasks();


  } catch (error) {
    console.error("Error while fetching Tasks", error);
  }

};


loadTasks();

btInsert.onclick = addTask;
btRemove.onclick = handleClickBtRemove;
