/*
    TO-DO LIST
    Add event handler
    Get input values
    Add the new item to our data structure
    Add the new item to the UI
    Calculate budget
    Update the UI

    UI MODULE
    Get input value
    Add the new item to the UI
    Update the UI

    DATA MODULE
    Add the new item to our data structure
    Calculate budget

    CONTROLLER MODULE - controls the whole app, act as a link between UI and DATA MODULES
    Add event handle
 */
/*
    Modules

    Important aspect of any robust application's architecture

    Keep the units of code for a project both cleanly separated and organized

    Encapsulate some data into privacy and expose other data publicly
 */

/*
    THIS KEYWORD

    This keyword creates an empty object and then calls the function and points to this
    keyword of that function to the new object that was created. When properties are set
    on the this keyword they are automatically set to the new object created
 */

// DATA MODULE
let budgetController = (function() {
  //function constructor
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  //function constructor
  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let data = {
    items: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  let calculateTotal = function(type) {
    let sum = 0;

    data.items[type].forEach((item, index, arr) => {
      sum += item.value;
    });
    data.totals[type] = sum;
  };

  let addItem = function(type, des, val) {
    let newItem, id;
    let itemArr = data.items[type];

    //Create new ID
    id = itemArr.length !== 0 ? itemArr[itemArr.length - 1].id + 1 : 0;

    //Create new item based on 'exp' or 'inc' type
    if (type === "exp") {
      newItem = new Expense(id, des, val);
    } else {
      newItem = new Income(id, des, val);
    }

    //Push it into our data structure
    data.items[type].push(newItem);

    //Return the new element
    return newItem;
  };

  let deleteItem = function(type, id) {
    let itemArr = data.items[type];

    data.items[type] = itemArr.filter(item => {
      return item.id !== parseInt(id);
    });
  };

  let calculateBudget = function() {
    //Calculate total income and expenses
    calculateTotal("exp");
    calculateTotal("inc");

    //Calculate the budget: income - expenses
    data.budget = data.totals.inc - data.totals.exp;

    //Calculate the percentage of income that we spent
    if (data.totals.inc > 0) {
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    } else {
      data.percentage = -1;
    }
  };

  let calculatePercentages = function() {
    data.items.exp.forEach(item => {
      item.calPercentage(data.totals.inc);
    });
  };

  let getPercentage = function() {
    return data.items.exp.map(item => {
      return item.getPercentage();
    });
  };

  let getBudget = function() {
    return {
      budget: data.budget,
      percentage: data.percentage,
      totalInc: data.totals.inc,
      totalExp: data.totals.exp
    };
  };

  return {
    addItem: addItem,
    deleteItem: deleteItem,
    calculateBudget: calculateBudget,
    calculatePercentages: calculatePercentages,
    getPercentage: getPercentage,
    getBudget: getBudget
  };
})();

// UI MODULE
let UIController = (function() {
  let DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensePercecntageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  let getInput = function() {
    return {
      type: document.querySelector(DOMStrings.inputType).value,
      description: document.querySelector(DOMStrings.inputDescription).value,
      value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
    };
  };

  let addListItem = function(obj, type) {
    let html, newHtml, element;
    let value = formatNumber(obj.value, type);
    //Create HTML string with placeholder text
    if (type === "inc") {
      element = DOMStrings.incomeContainer;
      html = `<div class="item clearfix" id="income-${
        obj.id
      }">\n<div class="item__description">${
        obj.description
      }</div>\n<div class="right clearfix">\n<div class="item__value">${value}</div>\n<div class="item__delete">\n<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n</div>\n</div>\n</div>`;
    } else {
      element = DOMStrings.expenseContainer;
      html = `<div class="item clearfix" id="expense-${
        obj.id
      }">\n<div class="item__description">${
        obj.description
      }</div>\n<div class="right clearfix">\n<div class="item__value">${value}</div>\n<div class="item__percentage">21%</div>\n<div class="item__delete">\n<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n</div>\n</div>\n</div>`;
    }

    //Replace the placeholder text with some actual data
    //No need to do html replace, template literals can be used, below shows the
    //.replace process
    // newHtml = html.replace('%id&', obj.id);
    // newHtml = html.replace('%description%', obj.description);
    // newHtml = html.replace('%value%', obj.value);

    //Insert the HTML into the DOM
    document.querySelector(element).insertAdjacentHTML("beforeend", html);
  };

  let deleteListItem = function(selectorID) {
    let el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
  };

  let clearFields = function() {
    let fields, fieldsArray;

    fields = document.querySelectorAll(
      `${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`
    );

    //tricks the slice method into thinking that we pass it an array, so it returns
    //an array
    fieldsArray = Array.prototype.slice.call(fields);

    fieldsArray.forEach((item, index, array) => {
      item.value = "";
    });

    //focus on the first item in the array
    fieldsArray[0].focus();
  };

  let displayBudget = function(obj) {
    let type = obj.budget > 0 ? "inc" : "exp";
    document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
      obj.budget,
      type
    );
    document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
    document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;

    if (obj.percentage !== -1) {
      document.querySelector(DOMStrings.percentageLabel).textContent = `${
        obj.percentage
      }%`;
    } else {
      document.querySelector(DOMStrings.percentageLabel).textContent = "0%";
    }
  };

  let nodeListForEach = function(nodeList, callback) {
    for (let i = 0; i < nodeList.length; i++) {
      callback(nodeList[i], i);
    }
  };

  let displayPercentages = function(percentages) {
    let fields = document.querySelectorAll(DOMStrings.expensePercecntageLabel);

    nodeListForEach(fields, function(current, index) {
      if (percentages[index] > 0) {
        current.textContent = `${percentages[index]}%`;
      } else {
        current.textContent = `---`;
      }
    });
  };

  let displayMonth = function() {
    let now = new Date();
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let today = {
      day: now.getDay(),
      month: now.getMonth(),
      year: now.getFullYear()
    };

    document.querySelector(DOMStrings.dateLabel).textContent = `${
      months[today.month]
    } ${today.year}`;
  };

  let formatNumber = function(num, type) {
    let numSplit, int, dec;
    /**
     *
     * + or - before the number
     * exactly 2 decimal points
     * comma separating the thousands
     *
     */

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");

    int = numSplit[0];
    if (int.length > 3) {
      int = `${int.substr(0, int.length - 3)},${int.substr(
        int.length - 3,
        int.length
      )}`;
    }
    dec = numSplit[1];

    return type === "exp" ? `- £${int}.${dec}` : `+ £${int}.${dec}`;
  };

  let changeType = function() {
    let fields = document.querySelectorAll(
      `${DOMStrings.inputType},${DOMStrings.inputDescription},${
        DOMStrings.inputValue
      }`
    );

    nodeListForEach(fields, function(current) {
      current.classList.toggle("red-focus");
    });

    document.querySelector(DOMStrings.inputBtn).classList.toggle("red");
  };

  return {
    getInput: getInput,
    addListItem: addListItem,
    deleteListItem: deleteListItem,
    clearFields: clearFields,
    displayBudget: displayBudget,
    displayPercentages: displayPercentages,
    displayMonth: displayMonth,
    changeType: changeType,
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// GLOBAL APP CONTROLLER MODULE
let controller = (function(budgetCtrl, UICtrl) {
  let setupEventListeners = function() {
    let DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.code === "Enter") {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changeType);
  };

  let updateBudget = function() {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();

    //2. Return budget
    let budget = budgetCtrl.getBudget();

    //3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  let updatePercentages = function() {
    //1. Calculate percentage
    budgetCtrl.calculatePercentages();

    //2. Read percentages from the budget controller
    let percentages = budgetCtrl.getPercentage();

    //3. Uppdate the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  let ctrlAddItem = function() {
    let input, newItem;

    //1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value)) {
      //2. Add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. Add the new item to the UI
      UICtrl.addListItem(newItem, input.type);

      //4. Clear fields
      UICtrl.clearFields();

      //5. Calculate and update budget
      updateBudget();

      //6. Calculate and update percentages
      updatePercentages();
    }
  };

  let ctrlDeleteItem = function(event) {
    let itemID, splitID, type, id;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      id = splitID[1];

      type = type === "expense" ? "exp" : "inc";

      //1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, id);

      //2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      //3. Update and show the new budget
      updateBudget();

      //4. Calculate and update percentages
      updatePercentages();
    }
  };

  function init() {
    console.log("Application has started");
    UICtrl.displayMonth();
    setupEventListeners();
  }

  return {
    init: init()
  };
})(budgetController, UIController);
