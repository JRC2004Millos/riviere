# RIVIERE Architecture Overview

## Overview

RIVIERE is a full-stack web application designed to manage a clothing catalog through a modern, responsive interface and a secure administration panel. The project demonstrates the implementation of a scalable architecture using modern web technologies.

## Technology Stack

* **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
* **Authentication:** NextAuth.js (JWT)
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Security:** bcrypt

## Architecture

The application separates presentation, business logic, and data access into distinct layers.

The frontend handles the user interface and communicates with protected API routes. Authentication is managed through NextAuth.js using JWT sessions, while Prisma provides type-safe access to the PostgreSQL database. Administrative pages are protected to ensure that only authenticated users can manage products.

## Design Decisions

I chose Next.js for its excellent developer experience and built-in support for modern React features. Prisma simplifies database management while maintaining strong type safety, and PostgreSQL provides a reliable relational database for product management.

During development, I used AI tools to accelerate research, debugging, and exploring alternative implementations. However, every solution was reviewed, tested, and adapted to fit the project's architecture and coding standards.
