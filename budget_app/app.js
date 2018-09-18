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
    };
    
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        }
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
        
    };
    
    return {
      getInput: function () {
          
          return {
          type: document.querySelector(DOMStrings.inputType).value, // will be either inc or exp
          description: document.querySelector(DOMStrings.inputDescription).value,
          value: document.querySelector(DOMStrings.inputValue).value
          };
      },
        
      addListItem: function (obj, type) {
          var html, newHtml, element;
         // create html string with placeholder text
          
          if (type === 'inc') {
              
                element  = DOMStrings.incomeContainer; 
              
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          } else if (type === 'exp') {
              
                element = DOMStrings.expensesContainer;
              
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          };
          
         // replace placeholder text with actual data
          
          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', obj.value);
          
          console.log(newHtml);
          
          
          
         // insert html into the dom
          
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
          
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
        
    };
    
    
    
    var ctrlAddItem = function () {
        var input, newItem;
        
        // 1. get input data
        
        input = UICtrl.getInput();
        
        // 2. add item to budget controller
        
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. add new item to UI
        
        UICtrl.addListItem(newItem, input.type);
        
        // 4. calculate the budget
        
        // 5. display budget
        
    }
    
    return {
        init: function () {
            console.log('App started.');
            setupEventListeners();
        }
    }
  
    
})(budgetController, UIController);

controller.init();
























