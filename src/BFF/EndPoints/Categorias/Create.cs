namespace API.EndPoints.Categorias;

public class Create : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/categorias", async (HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("Cadastro");
            var req = new HttpRequestMessage(HttpMethod.Post, "/categorias");
            req.Headers.TryAddWithoutValidation("Authorization", ctx.Request.Headers.Authorization.ToString());
            if (ctx.Request.ContentLength > 0)
                req.Content = new StreamContent(ctx.Request.Body)
                {
                    Headers = { ContentType = new(ctx.Request.ContentType ?? "application/json") }
                };
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .RequireAuthorization()
        .WithTags("Categorias")
        .WithSummary("Cria uma nova categoria");
    }
}
