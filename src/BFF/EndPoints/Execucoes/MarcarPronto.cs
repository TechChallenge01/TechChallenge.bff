namespace API.EndPoints.Execucoes;

public class MarcarPronto : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/execucoes/{id}/pronto", async (string id, HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("Execucao");
            var req = new HttpRequestMessage(HttpMethod.Put, $"/execucoes/{id}/pronto");
            req.Headers.TryAddWithoutValidation("Authorization", ctx.Request.Headers.Authorization.ToString());
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .RequireAuthorization()
        .WithTags("Execuções")
        .WithSummary("Marca execução como pronta");
    }
}
