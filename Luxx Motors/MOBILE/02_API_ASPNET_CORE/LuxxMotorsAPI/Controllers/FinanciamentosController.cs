using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LuxxMotorsAPI.Data;
using LuxxMotorsAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace LuxxMotorsAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FinanciamentosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FinanciamentosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostSimulacao(
            [FromBody] Financiamento simulacao)
        {
            if (simulacao == null)
                return BadRequest("Dados da simulação inválidos.");

            try
            {
                _context.FINANCIAMENTO.Add(simulacao);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    mensagem = "Simulação salva!",
                    id = simulacao.Id_financiamento
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    erro = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Financiamento>>>
            GetFinanciamentos()
        {
            return Ok(
                await _context.FINANCIAMENTO
                    .AsNoTracking()
                    .ToListAsync()
            );
        }
    }
}