namespace API.EndPoints.Execucoes;

public class Finalizar : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/execucoes/{id}/finalizar", async (string id, HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("Execucao");
            var req = new HttpRequestMessage(HttpMethod.Put, $"/execucoes/{id}/finalizar");
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
        .WithTags("Execuções")
        .WithSummary("Finaliza execução");
    }
}
