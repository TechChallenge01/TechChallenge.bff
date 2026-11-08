namespace API.EndPoints.Categorias;

public class GetAll : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/categorias", async (HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("Cadastro");
            var req = new HttpRequestMessage(HttpMethod.Get, "/categorias");
            req.Headers.TryAddWithoutValidation("Authorization", ctx.Request.Headers.Authorization.ToString());
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .RequireAuthorization()
        .WithTags("Categorias")
        .WithSummary("Lista todas as categorias");
    }
}
