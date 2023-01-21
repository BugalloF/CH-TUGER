function check_availability (enter,until,start){

let d1 = enter.split("/");
let d2 = until.split("/");
let c = start.split("/");

let from = new Date(d1);  
let to   = new Date(d2);
let check = new Date(c);
if (check >= from && check <= to) return false

else return true
}
// Para chequear que la entrada no sea antes que la salida.
function check_date (enter,until){

    let d1 = enter.split("/");
    let d2 = until.split("/");
    
    let from = new Date(d1);  
    let to   = new Date(d2);

    console.log();
    if (from >= to) return false
    
    else return true
    }
// console.log(check_availability("1/25/2022","1/31/2022","1/27/2022"));

module.exports={
    check_availability,
    check_date
}