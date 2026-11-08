using System.Reflection;
using API.EndPoints;

namespace API.Extensions;

public static class AppInitializer
{
    public static IServiceCollection AddEndpoints(this IServiceCollection services, Assembly assembly)
    {
        var endpoints = assembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && t.IsAssignableTo(typeof(IEndpoint)))
            .Select(Activator.CreateInstance).Cast<IEndpoint>();
        foreach (var e in endpoints) services.AddSingleton(e);
        return services;
    }

    public static IApplicationBuilder MapEndpoints(this WebApplication app)
    {
        foreach (var e in app.Services.GetServices<IEndpoint>()) e.MapEndpoint(app);
        return app;
    }
}
