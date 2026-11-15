using API.Extensions;

namespace UnitTests.Extensions;

public class ClaimsPrincipalExtensionTests
{
    [Fact]
    public void GetUserId_QuandoTemNameIdentifier_DeveRetornarGuid()
    {
        var userId = Guid.NewGuid();
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };
        var user = new ClaimsPrincipal(new ClaimsIdentity(claims));

        var result = user.GetUserId();

        result.Should().Be(userId);
    }

    [Fact]
    public void GetUserId_QuandoTemSubSemNameIdentifier_DeveRetornarGuid()
    {
        var userId = Guid.NewGuid();
        var claims = new[] { new Claim("sub", userId.ToString()) };
        var user = new ClaimsPrincipal(new ClaimsIdentity(claims));

        var result = user.GetUserId();

        result.Should().Be(userId);
    }

    [Fact]
    public void GetUserId_QuandoSemClaims_DeveLancarUnauthorized()
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity());

        var act = () => user.GetUserId();

        act.Should().Throw<UnauthorizedAccessException>()
            .WithMessage("*não autenticado*");
    }

    [Fact]
    public void GetUserId_QuandoNameIdentifierInvalido_DeveLancarFormatException()
    {
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "not-a-guid") };
        var user = new ClaimsPrincipal(new ClaimsIdentity(claims));

        var act = () => user.GetUserId();

        act.Should().Throw<Exception>();
    }
}
