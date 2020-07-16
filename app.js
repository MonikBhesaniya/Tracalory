//Storsge Control
 const StorageCtrl = ( function(){
    
    
    //public methods
    return{
        storeItem: function(item){
            let items = [];
            
            if(localStorage.getItem('items') === null){
                items = [];

                items.push(item);

                localStorage.setItem('items',JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);

                localStorage.setItem('items',JSON.stringify(items));
            }
        },

        getLocalItems: function(){

            if(localStorage.getItem('items') === null){
                return [];
            } else {
                return JSON.parse(localStorage.getItem('items'));
            }
        },

        updateStorage: function(updatedItem){
            let storage = JSON.parse(localStorage.getItem('items'));
            storage.forEach((item,index) => {
                if( updatedItem.id === item.id ){
                    storage.splice(index,1,updatedItem);
                }
            })
            localStorage.setItem('items',JSON.stringify(storage));
        },

        deleteFromStorage: function(id){
            let storage = JSON.parse(localStorage.getItem('items'));
            storage.forEach((item,index) => {
                if( id === item.id ){
                    storage.splice(index,1);
                }
            })
            localStorage.setItem('items',JSON.stringify(storage));

        },

        clear: function(){
            let items = [];
            localStorage.setItem('items',JSON.stringify(items));
        }
    }

 })();


//Item Control

const ItemCtrl = ( function(){

    const Item = function(id,name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items : StorageCtrl.getLocalItems(),
        // items: [
        //     {id : 0, name:'name1', calories:100},
        //     {id : 1, name:'name2', calories:200},
        //     {id : 2, name:'name3', calories:300}
        // ],
        currentItem : null,
        totalCalories : 0
    }

    //public functions
    return{        
        logData : function(){
            return data;
        },

        //get the items
        getItems : function(){
            return data.items;
        },

        //add new item
        addItem : function(name,calories){
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            calories = parseInt(calories);
            
            const newItem = new Item(ID,name,calories);

            data.items.push(newItem);
            return newItem;
        },

        //get total calories
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(item => {
                calories = parseInt(item.calories);
                total += calories;
                }               
            )           
            
            return total;
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },
        //edit item state
        getEditItem: function(id){
            let found = null;
            data.items.forEach(item => {
                // console.log(item);
                if(item.id == id){
                    found = item;
                }
            })
            
            return found;
        },

        //update item
        updateItem: function(item){
            data.currentItem.name = item.name;
            data.currentItem.calories = item.calories;
            // console.log(data.currentItem);
        },

        deleteItem: function(){
            data.items.forEach(item => {
                if(data.currentItem === item){
                    data.items.splice(data.currentItem.id,1);
                }
            })
            // console.log(data.items);
        },

        clearAll: function(){
            data.items = [];
            // console.log(data.items);
        }

        //get user inpput
        // userInput : function(){
        //     const meal = document.getElementById(UISelectors.meal);
        //     const calories = document.getElementById(UISelectors.calories);
            
        //     console.log(meal,calories);
        // }

    }
})();


//UI control

const UICtrl = ( function(){

    UISelectors = {
        itemList: '.item-list',
        meal: '#meal',
        calories: '#calories',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        removeBtn: '.remove-btn',
        backBtn: '.back-btn',
        totalCalories : '.total-calories',
        clearBtn: '.clear-btn'
    }

    //publoc functions
    return{

        //display items
        displayItems : function(items){

                let html = '';
                items.forEach((item) => {
                    
                    html +=`
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name} : </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content"> <i class="fa fa-pencil edit-item"></i></a>
                    </li>
                    `
                });   
                document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        //Add New Item to UI
        addNewItem: function(item){
            const li = document.createElement('li');

            li.className = 'collection-item';

            li.id = `item-${item.id}`;

            li.innerHTML= `<strong>${item.name} : </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"> <i class="fa fa-pencil edit-item"></i></a>`
            
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
            document.querySelector(UISelectors.itemList).style.display = 'block';

        },

        //clear fields
        clearFields: function(){
            document.querySelector(UISelectors.meal).value = '';
            document.querySelector(UISelectors.calories).value = '';
        },

        //hide the list if no-item
        hideList: function(){
            
            document.querySelector(UISelectors.itemList).style.display = 'none';
            // if(data.items.length === 0){
            //     document.querySelector(UISelectors.itemList).className = 'item-list';
            // } else {
            //     document.querySelector(UISelectors.itemList).className = 'item-list collection';
            // }
            
        },

        displayTotal: function(total){
            document.querySelector(UISelectors.totalCalories).innerHTML = total;
        },

        //clear edit stete
        clearEditState : function(){
            UICtrl.clearFields();
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.removeBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
        },
        //edit state
        EditState : function(){
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.removeBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        //get input from UI
        getItemInput: function(){
            return{
                name: document.querySelector(UISelectors.meal).value,
                calories : document.querySelector(UISelectors.calories).value,
            } 
        },

        //display edit item
        addItemToList: function(){
            document.querySelector(UISelectors.meal).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.calories).value = ItemCtrl.getCurrentItem().calories;
            this.EditState();
        },
        updateState: function(){
            const itemToUpdate = ItemCtrl.getCurrentItem();
            let ID = `item-${itemToUpdate.id}`;
            ID = ID.toString();
            // console.log(ID);
            // console.log(itemToUpdate);
            // document.querySelector(ID).innerHTML = `<strong>${itemToUpdate.name} : </strong> <em>${itemToUpdate.calories} Calories</em>
            // <a href="#" class="secondary-content"> <i class="fa fa-pencil edit-item"></i></a>`
            document.getElementById(ID).innerHTML = `<strong>${itemToUpdate.name} : </strong> <em>${itemToUpdate.calories} Calories</em>
            <a href="#" class="secondary-content"> <i class="fa fa-pencil edit-item"></i></a>`
            this.clearEditState();
        },

        deleteItem: function(){
            const itemDelete = ItemCtrl.getCurrentItem();
            let ID = `item-${itemDelete.id}`;
            ID = ID.toString();
            document.getElementById(ID).remove();
            this.clearEditState();
        },

        clearList: function(){
            document.querySelector(UISelectors.itemList).innerHTML = '';
            this.hideList();
        },
        getUISelectors: function(){
            return UISelectors;
        }
    }
})();


//App Control

const App = ( function(ItemCtrl,StorageCtrl,UICtrl){

    const loadEventlistenors = function(){
        //copy the UISelector private class
        const UISelectors = UICtrl.getUISelectors();
        //select the add button
        document.querySelector(UISelectors.addBtn).addEventListener('click',addItemSubmit);
        //select the edit icon
        document.querySelector(UISelectors.itemList).addEventListener('click',editItemSubmit);
        //select the update button
        document.querySelector(UISelectors.updateBtn).addEventListener('click',updateItemSubmit);
        //disable enter button
        document.addEventListener('keypress',(e) => {
            if( e.keycode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })
        //select the delete button
        document.querySelector(UISelectors.removeBtn).addEventListener('click',deleteItemSubmit);
         //select the back button
         document.querySelector(UISelectors.backBtn).addEventListener('click',backItemSubmit);
        //select the cleat all button
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearItemSubmit);
    }
    
    //add item submit
    const addItemSubmit = function(e){

        //get item frim UI
        const input = UICtrl.getItemInput();

        if( input.name !== '' && input.calories!== ''){

            //add to datastructure
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //add item to UI
            UICtrl.addNewItem(newItem);

            //get total calories
            const total = ItemCtrl.getTotalCalories();
            
            //display total calories
            UICtrl.displayTotal(total);

            //store into local storage
            StorageCtrl.storeItem(newItem);

            //clear fields
            UICtrl.clearFields();

            
        } else {

        }

        e.preventDefault();
    }

    //edit item submit
    const editItemSubmit = function(e){

        if(e.target.classList.contains('edit-item')){
            //find the id of clicked item
            const thisId = e.target.parentNode.parentNode.id;
            //get the actual ID
            const thisIdArr = thisId.split('-');
            // console.log(thisIdArr);
            const ID = parseInt(thisIdArr[1]);
            //get element from ItemCtr
            const editItem = ItemCtrl.getEditItem(ID);
            //set current item
            ItemCtrl.setCurrentItem(editItem);
            //display the item to be edited
            UICtrl.addItemToList();

        }


        e.preventDefault();
    }


    //update item submit
    const updateItemSubmit = function(e){

        //fetch the new data
        item = UICtrl.getItemInput();
        // console.log(item);
        //update item
        ItemCtrl.updateItem(item);
        //update UI
        UICtrl.updateState();
        //update into local storage
        StorageCtrl.updateStorage(item);
        //get total calories
        const total = ItemCtrl.getTotalCalories();
            
        //display total calories
        UICtrl.displayTotal(total);

        //clear fields
        UICtrl.clearFields();

        e.preventDefault();
    }

    //delete item submit
     const deleteItemSubmit = function(e){
        
        //delete from datastructure
        ItemCtrl.deleteItem();
        //delete from display
        UICtrl.deleteItem();
        //delete from storage
        StorageCtrl.deleteFromStorage(ItemCtrl.getCurrentItem().id);
        //get total calories
        const total = ItemCtrl.getTotalCalories();
            
        //display total calories
        UICtrl.displayTotal(total);

        //clear fields
        UICtrl.clearFields();

        if(total === 0){
            UICtrl.hideList();
        }

        e.preventDefault();
     }

     //back button
     const backItemSubmit = function(e){

        //Go to add state/Go back from edit state
        UICtrl.clearEditState();

        e.preventDefault();
    }

     //clear item submit
    const clearItemSubmit = function(e){
        
        //clear all items
        ItemCtrl.clearAll();
        
        // clear local storage
        StorageCtrl.clear();
        //clear the list
        UICtrl.clearList();

        //get total calories
        const total = ItemCtrl.getTotalCalories();
                
        //display total calories
        UICtrl.displayTotal(total);


        e.preventDefault();
    }

    //public functions
    return{

        init: function(){

             //clear update state
             UICtrl.clearEditState();
            //get the items
            const items = ItemCtrl.getItems();

            //get total calories
            const total = ItemCtrl.getTotalCalories();
                
            //display total calories
            UICtrl.displayTotal(total);


            if(items.length === 0){
                UICtrl.hideList();
            } else {
                //display items
                UICtrl.displayItems(items);
            }
        
            //call loadEventListener
            loadEventlistenors();
        }
    }

})(ItemCtrl,StorageCtrl,UICtrl);


App.init();