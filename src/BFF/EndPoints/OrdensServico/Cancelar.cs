namespace API.EndPoints.OrdensServico;

public class Cancelar : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/ordens-servico/{id}", async (string id, HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("OS");
            var req = new HttpRequestMessage(HttpMethod.Delete, $"/ordens-servico/{id}");
            req.Headers.TryAddWithoutValidation("Authorization", ctx.Request.Headers.Authorization.ToString());
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .RequireAuthorization()
        .WithTags("Ordens de Serviço")
        .WithSummary("Cancela uma OS");
    }
}
