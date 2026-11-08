namespace API.EndPoints.Estoque;

public class GetByProduto : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/estoque/{produtoId}", async (string produtoId, HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("Estoque");
            var req = new HttpRequestMessage(HttpMethod.Get, $"/estoque/{produtoId}");
            req.Headers.TryAddWithoutValidation("Authorization", ctx.Request.Headers.Authorization.ToString());
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .RequireAuthorization()
        .WithTags("Estoque")
        .WithSummary("Busca nível de estoque por produto");
    }
}
