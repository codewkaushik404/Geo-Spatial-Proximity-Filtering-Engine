import type {Coordinate} from "../zod.js";

function convertToRadians(degree: number){
    return (Math.PI/180.0)* degree;
}

export default function calcHaversineDistance(a: Coordinate, b: Coordinate){
    let lat1 = a.latitude, long1 = a.longitude;
    let lat2 = b.latitude, long2 = b.longitude;

    const dLat =  convertToRadians(lat1 - lat2);
    const dLong = convertToRadians(long1 - long2);

    lat1 = convertToRadians(lat1);
    lat2 = convertToRadians(lat2);

    const radius = 6371;

    const distance = 2*radius*Math.asin(
        Math.sqrt(
            Math.pow(Math.sin(dLat/2), 2) + 
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dLong/2), 2)
        )
    );

    return distance;
}