namespace API.EndPoints.OrdensServico;

public class IniciarDiagnostico : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/ordens-servico/{id}/iniciar-diagnostico", async (string id, HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("OS");
            var req = new HttpRequestMessage(HttpMethod.Post, $"/ordens-servico/{id}/iniciar-diagnostico");
            req.Headers.TryAddWithoutValidation("Authorization", ctx.Request.Headers.Authorization.ToString());
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .RequireAuthorization()
        .WithTags("Ordens de Serviço")
        .WithSummary("Inicia diagnóstico de uma OS");
    }
}
