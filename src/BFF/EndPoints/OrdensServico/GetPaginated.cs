namespace API.EndPoints.OrdensServico;

public class GetPaginated : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/ordens-servico", async (int page, int pageSize, HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("OS");
            var req = new HttpRequestMessage(HttpMethod.Get, $"/ordens-servico?page={page}&pageSize={pageSize}");
            req.Headers.TryAddWithoutValidation("Authorization", ctx.Request.Headers.Authorization.ToString());
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .RequireAuthorization()
        .WithTags("Ordens de Serviço")
        .WithSummary("Lista OSs paginadas");
    }
}
