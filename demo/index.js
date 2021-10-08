export const add = (a, b) => {
  return a + b;
}

// export function add(a, b){
//   return a + b;
// }

export const delayFunc = (cb) => {
  setTimeout(() => {
    cb && cb('success');
  }, 2000);
}

export const request = () => {

  return new Promise(resolve => {
    setTimeout(() => {
      resolve('success');
    }, 2000);
  })
}