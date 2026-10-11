import {z} from "zod";

export const latitudeSchema = z.coerce.number().min(-90).max(90);
export const longitudeSchema = z.coerce.number().min(-180).max(180);

export const coordinateSchema = z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema
});

export const queryFilterSchema = z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    minPrice: z.coerce.number().min(0).optional().default(0),
    maxPrice: z.coerce.number().optional(),
    distance: z.coerce.number().min(0).optional().default(10).transform((dist) => dist > 50 ? 50 : dist),
    limit: z.coerce.number().optional().default(10),
    availableOnly: z.enum(["true", "false"]).default("false").transform(v => v === "true")
})


export const hotelSchema = z.object({
    id: z.coerce.number(),
    name: z.string(),
    location: coordinateSchema,
    pricePerNight: z.coerce.number().min(0),
    isAvailable: z.enum(["true", "false"]).default("false").transform((val) => val === "true")
})

export const hotelsFileSchema = z.array(hotelSchema);

export type Filters = z.infer<typeof queryFilterSchema>;
export type Hotel = z.infer<typeof hotelSchema>;
export type Coordinate = z.infer<typeof coordinateSchema>;

