import express from "express";
import type { Request, Response } from "express";
import {queryFilterSchema, hotelsFileSchema} from "./zod.js";

import searchHotels from "./service/hotelSearchService.js";
import { readFileSync } from "node:fs";
import path from "node:path";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const filePath = path.join(process.cwd(), "src/data/hotel.json");
const hotels = JSON.parse(readFileSync(filePath, 'utf-8')).hotels;

app.get("/api/v1/hotels/search", (req: Request, res: Response) => {
    try{
        const filters = req.query;
        const query_result = queryFilterSchema.safeParse(filters);

        if(!query_result.success){
            return res.status(400).json({
                success: false,
                message: "Invalid query parameters",
                errors: query_result.error.issues
            })
        }

        /**
         * 1. If data is retrieved from db no need of db type check
         * 2. Prisma Syntax: We are creating a bounding box here for preliminary filtering
         *          prisma.hotels.findMany({
                    *     where: {
                    *          location: {
                    *              latitude: {
                    *                  gte: filters.latitude - Latdelta,
                    *                  lte: filters.latitude + Latdelta
                    *              },
                    * 
                    *              longitude: {
                    *                  gte: filters.longitude - Longdelta,
                    *                  lte: filters.longitude + Longdelta
                    *              }  
                    *          },
                    *          pricePerNight: {
                    *              gte: filters.minPrice, 
                    *              lte: filters.maxPrice
                    *          },
                    *          isAvailable: { filters.onlyAvailable}
                    *      }
                    * })
                    * 
            3. Calc distance and top k nodes 
            4. Learn how to calc. delta
         */
        const hotels_result = hotelsFileSchema.safeParse(hotels);
        if(!hotels_result.success){
            return res.status(400).json({
                success: false,
                message: "Invalid Hotels data",
                errors: hotels_result.error.issues
            })
        }

        const filteredHotels = searchHotels(hotels_result.data, query_result.data);

        if(filteredHotels.length === 0){
            return res.status(404).json({
                success: false,
                message: "No hotels found",
                errors: []
            });
        }

        return res.json({
            success: true,
            message: "Hotels fetched successfully",
            data: filteredHotels
        });

    }catch(err){
        if(err instanceof Error){
            console.error(err.message);
            console.error(err.stack);

            return res.status(500).json({
                success: false,
                message: err.message ?? "Internal Server Error",
                errors: []
            })
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            errors: []
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on :${PORT}`);
})


/**
 * 
 */