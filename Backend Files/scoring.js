//calculates the score of a single round with the users guess and location of image
function calculate_score(true_x, true_y, user_x, user_y){
    //finds a distance between the 2 locations
   const dist = euclidean_distance(true_x, true_y, user_x, user_y)

   let score 

    //removes padding from distances
    const max = 781
    score = Math.max(0, Math.min(5000, 5000 * (1 - dist / max) ** 2)) //calcs score with an exponential fall off of points
   return Math.round(score) //removes decimal
}

function euclidean_distance(x1, y1, x2, y2){
   //differences
    const dx = x2 - x1
    const dy = y2 - y1

    //distance equation
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist //multiply by high number to reduce any need for decimal places
}

//export the function
module.exports = {
    calculate_score
}












