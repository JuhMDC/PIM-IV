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
    public class VendasController : ControllerBase
    {
        private readonly AppDbContext _context;
        public VendasController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venda>>> GetVendas()
        {
            try 
            {
                var listaDeVendas = await _context.VENDA.ToListAsync(); 
                return Ok(listaDeVendas);
            }
            catch (Exception ex)
            {
                // IMPRIME O ERRO REAL NO TERMINAL DO DOTNET RUN
                Console.WriteLine($"[ERRO CRÍTICO EM VENDAS]: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[DETALHE DO BANCO - VENDAS]: {ex.InnerException.Message}");
                }
                return StatusCode(500, $"Erro interno na tabela Venda: {ex.Message}");
            }
        }
    }
}