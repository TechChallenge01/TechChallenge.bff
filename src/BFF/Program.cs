using System.Reflection;
using System.Text;
using API.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, ValidateAudience = true,
            ValidateLifetime = true, ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddHttpClient("Auth",     c => c.BaseAddress = new Uri(builder.Configuration["Services:Auth"]!));
builder.Services.AddHttpClient("OS",       c => c.BaseAddress = new Uri(builder.Configuration["Services:OS"]!));
builder.Services.AddHttpClient("Billing",  c => c.BaseAddress = new Uri(builder.Configuration["Services:Billing"]!));
builder.Services.AddHttpClient("Cadastro", c => c.BaseAddress = new Uri(builder.Configuration["Services:Cadastro"]!));
builder.Services.AddHttpClient("Estoque",  c => c.BaseAddress = new Uri(builder.Configuration["Services:Estoque"]!));
builder.Services.AddHttpClient("Execucao", c => c.BaseAddress = new Uri(builder.Configuration["Services:Execucao"]!));

builder.Services.AddOpenApi();
builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference(options => { options.Title = "TechChallenge BFF"; options.Theme = ScalarTheme.DeepSpace; });

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/health", () => Results.Ok(new { status = "healthy" })).ExcludeFromDescription();

app.UseAuthentication();
app.UseAuthorization();
app.MapEndpoints();

app.MapFallbackToFile("index.html");

app.Run();
