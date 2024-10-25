using cinema.wwwapi.Endpoints;
using cinema.wwwapi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS middleware
app.UseCors();

// In-memory data storage with seed data
var customers = new List<Customer>
{
    new Customer(1, "Chris Wolstenholme", "chris@muse.mu", "+44729388192", DateTime.UtcNow, DateTime.UtcNow),
    new Customer(2, "Matt Bellamy", "matt@muse.mu", "+44729388193", DateTime.UtcNow, DateTime.UtcNow)
};

var movies = new List<Movie>
{
    new Movie(1, "Dodgeball", "PG-13", "The greatest movie ever made.", 126, DateTime.UtcNow, DateTime.UtcNow),
    new Movie(2, "Inception", "PG-13", "A mind-bending thriller.", 148, DateTime.UtcNow, DateTime.UtcNow)
};

var screenings = new List<Screening>
{
    new Screening
    {
        Id = 1,
        ScreenNumber = 5,
        Capacity = 40,
        StartsAt = DateTime.UtcNow.AddDays(5),
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        Seats = Enumerable.Range(1, 40).Select(i => new Seat { Id = i, ScreeningId = 1, IsOccupied = false }).ToList(),
        Movie = movies.First(m => m.Id == 1) // Reference to the movie
    },
    new Screening
    {
        Id = 2,
        ScreenNumber = 3,
        Capacity = 30,
        StartsAt = DateTime.UtcNow.AddDays(3),
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        Seats = Enumerable.Range(1, 30).Select(i => new Seat { Id = i, ScreeningId = 2, IsOccupied = false }).ToList(),
        Movie = movies.First(m => m.Id == 2) // Reference to the movie
    }
};

// Map Endpoints
app.MapCustomerEndpoints(customers);
app.MapMovieEndpoints(movies);
app.MapScreeningEndpoints(screenings);

app.Run();



