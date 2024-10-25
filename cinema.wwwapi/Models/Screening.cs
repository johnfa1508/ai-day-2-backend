namespace cinema.wwwapi.Models
{
    public class Screening
    {
        public int Id { get; set; }
        public int ScreenNumber { get; set; }
        public int Capacity { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<Seat> Seats { get; set; } = new List<Seat>();
        public Movie Movie { get; set; } // Add this line
    }

    public class Seat
    {
        public int Id { get; set; }
        public int ScreeningId { get; set; }
        public bool IsOccupied { get; set; }
    }
}


