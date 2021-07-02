const Person = function(fname, age) {
    this.fname = fname;
    this.age = age;
}

Person.prototype.speak = function() {
    console.log(`${this.fname} is speaking`);
}

const Student = function(fname, age, major) {
    Person.call(this, fname, age);
    this.major = major;
}

Student.prototype = Object.create(Person.prototype);
console.log(Student.prototype.__proto__ === Person.prototype);

const ian = new Student('Ian', 20, 'Math/CS');
console.log(ian instanceof Person);
ian.speak();
