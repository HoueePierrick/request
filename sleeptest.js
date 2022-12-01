async function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

const counter = async () => {
  let i = 0;
  console.log(i);
  for (let j = 0; j < 10; j++) {
    await sleep(1000);
    i = i + 1;
    console.log(i);
  }
};

counter();
