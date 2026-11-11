using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LuxxMotorsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var email = _configuration["LoginTeste:Email"];
            var senha = _configuration["LoginTeste:Senha"];
            var chaveJwt = _configuration["Jwt:Key"];
            var emissor = _configuration["Jwt:Issuer"];
            var audiencia = _configuration["Jwt:Audience"];

            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(senha) ||
                string.IsNullOrWhiteSpace(chaveJwt))
            {
                return StatusCode(500, new
                {
                    mensagem = "Configuração de login ou JWT ausente."
                });
            }

            if (request.Email != email || request.Senha != senha)
            {
                return Unauthorized(new
                {
                    mensagem = "E-mail ou senha inválidos."
                });
            }

            var chave = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(chaveJwt));

            var credenciais = new SigningCredentials(
                chave, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, request.Email),
                new Claim(ClaimTypes.Role, "Vendedor")
            };

            var token = new JwtSecurityToken(
                issuer: emissor,
                audience: audiencia,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credenciais
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                tipo = "Bearer",
                expiraEm = token.ValidTo
            });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }
}