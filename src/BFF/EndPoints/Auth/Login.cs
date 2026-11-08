namespace API.EndPoints.Auth;

public class Login : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/login", async (
            HttpContext ctx,
            IHttpClientFactory factory,
            CancellationToken ct) =>
        {
            var client = factory.CreateClient("Auth");
            var req = new HttpRequestMessage(HttpMethod.Post, "/auth/cpf");
            if (ctx.Request.ContentLength > 0)
                req.Content = new StreamContent(ctx.Request.Body)
                {
                    Headers = { ContentType = new(ctx.Request.ContentType ?? "application/json") }
                };
            var res = await client.SendAsync(req, ct);
            var body = await res.Content.ReadAsStringAsync(ct);
            return Results.Text(body, "application/json", statusCode: (int)res.StatusCode);
        })
        .AllowAnonymous()
        .WithTags("Auth")
        .WithSummary("Autentica via CPF e retorna JWT");
    }
}
