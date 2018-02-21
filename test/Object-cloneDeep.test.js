var xjs = require('../index.js')

  let x = { first: 1, second: { value: 2 }, third: [1, '2', { v:3 }] }
  let y = xjs.Object.cloneDeep(x)
  console.log(`x: ${x}`)
  console.log(`y: ${y}`)
  console.log(`x===y: ${x===y}`)
  console.log(`xjs.Object.is(x,y): ${xjs.Object.is(x,y)}`)
