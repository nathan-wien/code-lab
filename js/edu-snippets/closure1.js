function foo() {
    let cnt = 0;

    return function() {
        cnt++;
        console.log(cnt);
    }
}

const foo1 = foo();
const foo2 = foo();

foo1.call();
foo1.call();
foo1.call();
