using API.Middleware;
using Application.Activities.Queries;
using Application.Activities.Validators;
using Application.Core;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//Add Cors
builder.Services.AddCors();

//Add MediatR (usando RegisterServicesFromAssemblyContaining para buscar los handlers, en este caso GetActivityList.Handler, luego cualquiera de los handlers se registrara automaticamente)
builder.Services.AddMediatR(x =>
{
    x.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>();
    x.AddOpenBehavior(typeof(ValidationBeahavior<,>));
});

//Add AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

//Add Middleware exception
builder.Services.AddTransient<ExceptionMiddleware>();

//Add FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

var app = builder.Build();

// Configure the HTTP request pipeline.
// use middleware
app.UseMiddleware<ExceptionMiddleware>();

//app.UseAuthorization();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod()
    .WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>()));
app.MapControllers();

//
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await DbInitializer.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}
 
app.Run();
