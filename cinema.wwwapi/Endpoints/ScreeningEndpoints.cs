using cinema.wwwapi.Models;

namespace cinema.wwwapi.Endpoints
{
    public static class ScreeningEndpoints
    {
        public static void MapScreeningEndpoints(this WebApplication app, List<Screening> screenings)
        {
            app.MapPost("/screenings", (Screening screening) =>
            {
                screening.CreatedAt = DateTime.UtcNow;
                screening.UpdatedAt = DateTime.UtcNow;
                for (int i = 0; i < screening.Capacity; i++)
                {
                    screening.Seats.Add(new Seat { ScreeningId = screening.Id, IsOccupied = false });
                }
                screenings.Add(screening);
                return Results.Created($"/screenings/{screening.Id}", screening);
            });

            app.MapGet("/screenings", () => screenings);

            app.MapPost("/screenings/{screeningId}/seats/{seatId}/select", (int screeningId, int seatId) =>
            {
                var screening = screenings.FirstOrDefault(s => s.Id == screeningId);
                if (screening == null)
                {
                    return Results.NotFound();
                }

                var seat = screening.Seats.FirstOrDefault(s => s.Id == seatId);
                if (seat == null)
                {
                    return Results.NotFound();
                }

                if (seat.IsOccupied)
                {
                    return Results.BadRequest("Seat is already occupied.");
                }

                seat.IsOccupied = true;
                screening.UpdatedAt = DateTime.UtcNow;
                return Results.Ok(seat);
            });
        }
    }
}