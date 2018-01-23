const User= require('./user.js');
const Todo= require('./todo.js');
const TodoItem= require('./todoItem.js');
const regenerateItem = function(item,ItemParentClass){
  item.__proto__ = new ItemParentClass().__proto__;
}

const regenerateTodos = function(todo,TodoParentClass,ItemParentClass){
  todo.__proto__ = new TodoParentClass().__proto__;
  todo.forEachItem(function(item){
    regenerateItem(item,ItemParentClass)
  })
}

const giveBehavior = function(allUser) {
  allUser.forEach(user=>{
    user.__proto__ = new User().__proto__;
    user.forEachTodo(function(todo){
      regenerateTodos(todo,Todo,TodoItem);
    })
  })
  return allUser;
}

class UserRegistry {
  constructor(fs,storagePath){
    this.fs = fs;
    this.storagePath = storagePath;
    this.users = [];
  }

  load(){
    let userData = this.fs.readFileSync(this.storagePath,'utf8');
    let users = giveBehavior(JSON.parse(userData));
    this.users = users || [];
  }

  getAUser(userName){
    let user = this.users.find(u=>u.userName==userName);
    return user;
  }

  write(){
    let contentToWrite = JSON.stringify(this.users,null,2);
    this.fs.writeFile(this.storagePath,contentToWrite,()=>{});
  }

  addNewUser(newUser){
    this.users.unshift(newUser);
  }

}
module.exports = UserRegistry;