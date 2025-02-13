//calculates the score of a single round with the users guess and location of image
function calculate_score(true_lat, true_long, user_lat, user_long){
    //finds a distance between the 2 locations
   const dist = euclidean_distance(true_lat, true_long, user_lat, user_long)

   let score 

   if(dist <= 5){ //padding around area for 100% points
    score = 5000
   }else{
    //removes padding from distances
    const ad_dist = dist - 5
    const ad_max = 178 - 5
    score = Math.max(0, Math.min(5000, 5000 * (1 - ad_dist / ad_max) ** 2)) //calcs score with an exponential fall off of points
   }
   return Math.round(score) //removes decimal
}

function euclidean_distance(lat1, lon1, lat2, lon2){
   //differences
    const dlat = lat2 - lat1
    const dlon = lon2 - lon1

    //distance equation
    const dist = Math.sqrt(dlat * dlat + dlon * dlon)
    return Math.round(dist * 10000) //multiply by high number to reduce any need for decimal places
}

//export the function
module.exports = {
    calculate_score
}














// =================Testing Lines========================
// console.log('height',calculate_score(44.56766730220258, -123.28959983789187, 44.55767469824912, -123.2896888691443))
// console.log('width', calculate_score(44.55977402745042, -123.2750217935866, 44.55767469824912, -123.2896888691443))
// // target: 44.564864°N 123.278903°W
// // close: 44.564886°N 123.277559°W
// // far: 44.567424°N 123.275587°W
// // threshold: 44.564871°N 123.278666°W
// // rfar: 44.559079°N 123.284300°W
// console.log('close',calculate_score(44.564864, -123.278903, 44.564886, -123.277559))
// console.log('far', calculate_score(44.564864, -123.278903, 44.567424, -123.275587))
// console.log('rfar', calculate_score(44.564864, -123.278903, 44.559079, -123.284300))
// console.log('threshold', calculate_score(44.564864, -123.278903, 44.564871, -123.278666))