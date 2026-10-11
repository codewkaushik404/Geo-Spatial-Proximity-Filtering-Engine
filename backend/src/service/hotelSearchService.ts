import type { Filters, Hotel } from "../zod.js";
import calcHaversineDistance from "../utils/haversine.js";
import { MaxPriorityQueue } from "@datastructures-js/priority-queue";

export default function searchHotels(hotels: Hotel[], filter: Filters): Hotel[] {
    const maxHeap = new MaxPriorityQueue<{hotel: Hotel, distance: number}>(e => e.distance);
    for(const hotel of hotels){

        if(filter.limit <= 0) return [];
        if(filter.availableOnly && !hotel.isAvailable) continue;
        if((hotel.pricePerNight < filter.minPrice) || ( filter.maxPrice !== undefined && hotel.pricePerNight > filter.maxPrice)) continue;

        const distance = calcHaversineDistance(
            {latitude: filter.latitude, longitude: filter.longitude}, 
            hotel.location
        );

        if(distance > filter.distance) continue;

        maxHeap.enqueue({hotel, distance});
        if(maxHeap.size() > filter.limit) maxHeap.dequeue();
    }

    return maxHeap.toArray().sort((a, b) => a.distance - b.distance).map(e => e.hotel);
}