package com.example.movies;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Movie resource")
public record Movie(
        @Schema(description = "Auto-generated ID", example = "1714900000000", accessMode = Schema.AccessMode.READ_ONLY)
        String id,
        @Schema(description = "Movie title", example = "Blade Runner")
        String title,
        @Schema(description = "Release year", example = "1982")
        int year,
        @Schema(description = "Director name", example = "Ridley Scott")
        String director,
        @Schema(description = "Rating out of 10", example = "8.1")
        Double rating) {
    public Movie withId(String newId) {
        return new Movie(newId, title, year, director, rating);
    }
}