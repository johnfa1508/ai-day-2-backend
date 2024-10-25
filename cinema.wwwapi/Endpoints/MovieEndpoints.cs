using cinema.wwwapi.Models;

namespace cinema.wwwapi.Endpoints
{
    public static class MovieEndpoints
    {
        public static void MapMovieEndpoints(this WebApplication app, List<Movie> movies)
        {
            app.MapPost("/movies", (Movie movie) =>
            {
                movie = movie with { CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
                movies.Add(movie);
                return Results.Created($"/movies/{movie.Id}", movie);
            });

            app.MapGet("/movies", () => movies);

            app.MapPut("/movies/{id}", (int id, Movie updatedMovie) =>
            {
                var movie = movies.FirstOrDefault(m => m.Id == id);
                if (movie is null) return Results.NotFound();

                movie = movie with
                {
                    Title = updatedMovie.Title,
                    Rating = updatedMovie.Rating,
                    Description = updatedMovie.Description,
                    RuntimeMins = updatedMovie.RuntimeMins,
                    UpdatedAt = DateTime.UtcNow
                };
                return Results.NoContent();
            });

            app.MapDelete("/movies/{id}", (int id) =>
            {
                var movie = movies.FirstOrDefault(m => m.Id == id);
                if (movie is null) return Results.NotFound();

                movies.Remove(movie);
                return Results.NoContent();
            });
        }
    }
}

