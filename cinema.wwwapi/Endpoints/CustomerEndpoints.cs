using cinema.wwwapi.Models;

namespace cinema.wwwapi.Endpoints
{
    public static class CustomerEndpoints
    {
        public static void MapCustomerEndpoints(this WebApplication app, List<Customer> customers)
        {
            app.MapPost("/customers", (Customer customer) =>
            {
                customer = customer with { CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
                customers.Add(customer);
                return Results.Created($"/customers/{customer.Id}", customer);
            });

            app.MapGet("/customers", () => customers);

            app.MapPut("/customers/{id}", (int id, Customer updatedCustomer) =>
            {
                var customer = customers.FirstOrDefault(c => c.Id == id);
                if (customer is null) return Results.NotFound();

                customer = customer with
                {
                    Name = updatedCustomer.Name,
                    Email = updatedCustomer.Email,
                    Phone = updatedCustomer.Phone,
                    UpdatedAt = DateTime.UtcNow
                };
                return Results.NoContent();
            });

            app.MapDelete("/customers/{id}", (int id) =>
            {
                var customer = customers.FirstOrDefault(c => c.Id == id);
                if (customer is null) return Results.NotFound();

                customers.Remove(customer);
                return Results.NoContent();
            });
        }
    }
}

