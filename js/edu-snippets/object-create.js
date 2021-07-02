const personProto = {
    sayHello: function() {
        console.log('hello!!!');
    }
};

const me = Object.create(personProto);

console.log(me.__proto__ === personProto);
