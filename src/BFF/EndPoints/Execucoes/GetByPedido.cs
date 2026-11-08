namespace API.EndPoints.Execucoes;

public class GetByPedido : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/execucoes/pedido/{pedidoId}", async (string pedidoId, HttpContext ctx, IHttpClientFactory factory, CancellationToken ct) =>
        {
            var client = factory.CreateClient("Execucao");
            var req = new HttpRequestMessage(HttpMethod.Get, $"/execucoes/pedido/{pedidoId}");
            req.Headers.TryAddWithoutValidation("Authorization", ctx.Request.Headers.Authorization.ToString());
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .RequireAuthorization()
        .WithTags("Execuções")
        .WithSummary("Busca execução por pedido");
    }
}
