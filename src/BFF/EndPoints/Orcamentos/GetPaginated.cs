namespace API.EndPoints.Orcamentos;

public class GetPaginated : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/orcamentos", async (HttpContext ctx, IHttpClientFactory factory, CancellationToken ct, int page = 1, int pageSize = 50) =>
        {
            var client = factory.CreateClient("Billing");
            var req = new HttpRequestMessage(HttpMethod.Get, $"/orcamentos?page={page}&pageSize={pageSize}");
            req.Headers.TryAddWithoutValidation("Authorization", ctx.Request.Headers.Authorization.ToString());
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .RequireAuthorization()
        .WithTags("Orçamentos")
        .WithSummary("Lista orçamentos paginados");
    }
}
