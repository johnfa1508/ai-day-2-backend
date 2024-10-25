namespace cinema.wwwapi.Models
{
    public record Movie(int Id, string Title, string Rating, string Description, int RuntimeMins, DateTime CreatedAt, DateTime UpdatedAt);
}

