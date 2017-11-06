function  Logger(tracker) {
    this.tracker = tracker;

    // Logger
    this.el = document.createElement("div");
    this.el.classList = "logger mb3";
    this.el.id = "logger";

    // Task Picker
    this.task_picker = this.createInputGroup("task-picker", "select", "Task");

    // Add initial option to task picker
    let option = document.createElement("option");
    option.textContent = "Select Task";
    this.task_picker.querySelector("#task-picker").appendChild(option);

    // Task date
    this.date_picker = this.createInputGroup("date-picker", "date", "Task Date");

    // Task amount input
    this.amount = this.createInputGroup("units-input", "number", "");
    this.amount.querySelector("label").id = "units";

    // Event listeners
    this.task_picker.querySelector("#task-picker").addEventListener("change", e => {
        this.amount.querySelector("label").textContent = e.target.selectedOptions[0].dataset.unit;
    });
    this.amount.querySelector("#units-input").addEventListener('keypress', e => {
        if(e.key == "Enter")
            this.addLog();
    });
}

Logger.prototype.createInputGroup = function(name, type, labelText) {
    // Row
    let row = document.createElement("div");
    row.classList = "r";

    // Columns
    let col1 = document.createElement("div");
    col1.classList = "c6";
    let col2 = col1.cloneNode();

    // Label
    let label = document.createElement("label");
    label.for = name;
    label.textContent = labelText;

    // Input
    let input = type == "select" ? document.createElement("select") : document.createElement("input");
    if(type != "select")
        input.type = type;
    input.name = name;
    input.id = name;

    // Assemble
    col1.appendChild(label);
    col2.appendChild(input);
    row.appendChild(col1);
    row.appendChild(col2);

    return row;
};

Logger.prototype.install = function() {
    console.group("Logger");
    console.log("Installing Logger...");

    let header = document.createElement("h2");
    header.textContent="Logger";
    header.classList = "mb3";
    this.el.appendChild(header);
    this.el.appendChild(this.task_picker);
    this.el.appendChild(this.date_picker);
    this.el.appendChild(this.amount);

    document.body.appendChild(this.el);
    console.log("Done.");
    console.groupEnd("Logger");
};

Logger.prototype.addTask = function(goal) {
    var option = document.createElement("option");
    option.name = goal.name;
    option.value = goal.name;
    option.textContent = goal.name;
    option.dataset.unit = goal.unit;
    this.task_picker.querySelector("#task-picker").appendChild(option);
};

Logger.prototype.addLog = function() {
    var log = {
        date: this.date_picker.querySelector("#date-picker").value,
        task: this.task_picker.querySelector("#task-picker").value,
        amount: Number(this.amount.querySelector("#units-input").value)
    };

    this.tracker.addLog(log);
};