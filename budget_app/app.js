/*
TO DO LIST
    1. add event handler
    2. get input values
    3. add the new item to our data structure
    4. add the new item to ui
    5. calculate budget
    6. update ui
 
MODULES
    1. ui module
        a. get input values
        b. add the new item to ui
        c. update ui
    2. data module
        a. add the new item to our data structure
        b. calculate budget
    3. controller module
        a. add event handler
*/
// budget controller
var budgetController = (function() {
    
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function (totalIncome) {
       if (totalIncome > 0) { 
        this.percentage = Math.round((this.value / totalIncome) * 100);
       } else if (totalIncome === 0) {
           this.percentage = -1;
       }
        
    };
    
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function (type) {
        
        var sum = 0;
        data.allItems[type].forEach(function (cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
    };
    
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            //create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else { ID = 0;};
            
            //create new item based in inc or exp
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            //push it into our data structure
            data.allItems[type].push(newItem);
            
            // return the new element
            return newItem;
        },
        
        deleteItem: function(type, ID) {
            var ids, index;   
         
            ids = data.allItems[type].map(function(current) {
                                  return current.id;
                                  });  // for alternative
            
            index = ids.indexOf(ID);
            if (index !== -1) {
                
               data.allItems[type].splice(index, 1);   
            };
            
        },
        
        calculateBudget: function () {
            
            // calculate total income and expenses
            
            calculateTotal('exp');
            calculateTotal('inc');
            
            // calculate budget: income - exp
            
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate percentage of income
            if (data.totals.inc > 0){
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
            
            
        },
        
        calculatePercentages: function(){
            
            /*
            a = 20
            b = 10
            c = 40
            
            income = 100
            
            a -> 20%
            ...
            
            */
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
              
        },
        
        getPercentages: function () {
          
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.percentage;
            });
            return allPerc;
        },
        
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
            
        },
        
        testing: function() {
            console.log(data);
        }
    }
    
    
})();



// ui controller
var UIController = (function() {
    
    var DOMStrings  = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenceLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercLabel: '.item__percentage'
        
    };
    
    var formatNumber = function(number, type) {
            var numberSplit, int, dec;
            //plus or minus before number
            
            // 2 decimal numbers
            
            // comma separating the thousands
            
            number = Math.abs(number);
            number = number.toFixed(2);
            
            numberSplit = number.split('.');
            
            int = numberSplit[0];
            dec = numberSplit[1];
            
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
            };
            
            
            return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
            
        };
    
    return {
      getInput: function () {
          
          return {
          type: document.querySelector(DOMStrings.inputType).value, // will be either inc or exp
          description: document.querySelector(DOMStrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
          };
      },
        
      addListItem: function (obj, type) {
          var html, newHtml, element;
         // create html string with placeholder text
          
          if (type === 'inc') {
              
                element  = DOMStrings.incomeContainer; 
              
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          } else if (type === 'exp') {
              
                element = DOMStrings.expensesContainer;
              
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          };
          
         // replace placeholder text with actual data
          
          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
          
          //console.log(newHtml);
          
          
          
         // insert html into the dom
          
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
          
      },
        
      deleteListItem: function(selectorID) {
          var el = document.getElementById(selectorID);
          el.parentNode.removeChild(el);
      },
      // clear input fields and focus on description  
      clearFields: function () {
          var fields, fieldsArr;
          
          fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue); // this returns a list
          
          fieldsArr = Array.prototype.slice.call(fields);//this converts list to array
         
          
          fieldsArr.forEach(function (current, index, array) {
              current.value = '';
          }); // alternative to for loop
          
          fieldsArr[0].focus(); // sets focus on desc.
      },
        
        displayBudget: function (obj) {
            
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber (obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenceLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            if (obj.percentage > 0) {
               document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'; 
            } else {
               document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            };
            
        },
        
        displayPercentages: function(percentages) {
          
            var fields = document.querySelectorAll(DOMStrings.expPercLabel);
            // something powerfull!!
            
            var nodeListForEach = function(list, callback) {
                
              for (var i = 0; i < list.length; i++) {
                  
                  callback(list[i], i);
                  
              }
                
            };
            
            nodeListForEach(fields, function(cur, index) {
                
                //do stuff
                if (percentages[index] > 0) {
                cur.textContent = percentages[index] + '%';
                } else {
                    
                    cur.textContent = '---';
                    
                }
                
            });
            
        },
        
      getDOMStrings: function () {
          return DOMStrings;
      }
    }; 
    
})();


// global app controller
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function () {
        
        var DOM = UICtrl.getDOMStrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress' , function(event) {
       
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
    };
    
    var updateBudget = function () {
        
        // 1. calculate the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        var budget = budgetCtrl.getBudget();
        // 3. display budget
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function() {
      
        //1. calculate percentage
        budgetCtrl.calculatePercentages();
        
        //2. read perc. from the budget ctrl
       var percentages = budgetCtrl.getPercentages();
       // console.log(percentages);
        //3. update UI
        UICtrl.displayPercentages(percentages);
    };
    
    var ctrlAddItem = function () {
        var input, newItem;
        
        // 1. get input data
        
        input = UICtrl.getInput();
        
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            
            // 2. add item to budget controller

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. add new item to UI

            UICtrl.addListItem(newItem, input.type);
            // 4. clear the fields

            UICtrl.clearFields();

            // 5. calculate and update budget
            updateBudget();
            
            //6. calculate and update percentages
            updatePercentages();
        
        }
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        
        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. delete item from ui
            UICtrl.deleteListItem(itemID);
            // 3. update and show new budget
            updateBudget();  
            // 4. update percentages
            updatePercentages();
        };
    }
    
    return {
        init: function () {
            console.log('App started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: '---'
            });
            setupEventListeners();
        }
    }
  
    
})(budgetController, UIController);

controller.init();

























