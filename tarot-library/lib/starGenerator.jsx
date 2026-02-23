function* starGenerator() {
    while (true) {
       yield {
        id: Math.random().toString(36).slice(2),
        left: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        size: 10 + Math.random() * 5
      }
    }
}

module.exports ={
    starGenerator
}