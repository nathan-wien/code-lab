const Person = function(firstname, age) {
    this.firstname = firstname;
    this.age = age;
}

const p = new Person('yugi', 20);
console.log(Person.prototype);

console.log(p.__proto__ == Person.prototype);
console.log(Person.prototype === p.__proto__);
console.log(Person.prototype.__proto__ === Object.prototype);
console.log(p.__proto__.__proto__ === Object.prototype);
