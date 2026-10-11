## Introduction

A hotel search system built with TypeScript, Prisma, and PostgreSQL, designed to filter hotels by price and availability and find nearby stays based on geographic coordinates.

## Background

A naive approach to location-based search would fetch all matching hotels, calculate the distance of each hotel from the user's location, sort every result by distance, and return the closest hotels. This becomes inefficient as the dataset grows.

A better approach is to use a **geographic bounding box** to narrow down candidate hotels before calculating their actual distances. A **Max Heap** can then efficiently maintain the closest `K` hotels without sorting every candidate.

For production-scale geographic search, **PostGIS with spatial indexes** is a potential next step to optimize location filtering and distance queries directly in the database.

## Tech Stack
- TypeScript
- Node.js
- Zod
- Prisma ORM
- PostgreSQL
- PostGIS (for advanced geographic queries)