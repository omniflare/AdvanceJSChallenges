//to implement a chain addition function
//console.log (add(10).add(10).add(5).sum())  ---> return 25 to console

function add(n) {
  if (typeof n !== "number" || isNaN(n)) {
    throw new Error("Only a number is allowed!!!");
  }

  let sum = n;
  return {
    add(value) {
      if (typeof n !== "number" || isNaN(n)) {
        throw new Error("Only a number is allowed!!!");
      }
      sum += value;
      console.log("at " + n + "sum " + sum);
      return this;
    },
    sum() {
      return sum;
    },
  };
}

console.log(add(20).add(40).add(90).sum());
