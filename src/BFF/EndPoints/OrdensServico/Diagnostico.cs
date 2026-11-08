namespace API.EndPoints.OrdensServico;

public class Diagnostico : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/ordens-servico/{id}/diagnostico", async (string id, HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("OS");
            var req = new HttpRequestMessage(HttpMethod.Post, $"/ordens-servico/{id}/diagnostico");
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
        .WithTags("Ordens de Serviço")
        .WithSummary("Registra diagnóstico de uma OS");
    }
}
