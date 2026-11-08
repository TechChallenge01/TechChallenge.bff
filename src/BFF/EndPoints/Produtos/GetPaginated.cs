namespace API.EndPoints.Produtos;

public class GetPaginated : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/produtos", async (int page, int pageSize, HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("Cadastro");
            var req = new HttpRequestMessage(HttpMethod.Get, $"/produtos?page={page}&pageSize={pageSize}");
            req.Headers.TryAddWithoutValidation("Authorization", ctx.Request.Headers.Authorization.ToString());
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .RequireAuthorization()
        .WithTags("Produtos")
        .WithSummary("Lista produtos paginados");
    }
}
