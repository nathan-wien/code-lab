class Num {
	constructor(val) {
		this.val = val;
	}

	get value() {
		return this.val;
  }

	set value(val) {
		this.val = val;
	}
}

const n = new Num(10);
console.log(n.value);
n.value = 20;
console.log(n.value);
