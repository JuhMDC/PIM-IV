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
    public class VeiculosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VeiculosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Veiculos
        // Lista veículos com filtros opcionais
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Veiculo>>> GetVeiculos(
            [FromQuery] string? marca,
            [FromQuery] string? modelo,
            [FromQuery] string? cor,
            [FromQuery] decimal? precoMax,
            [FromQuery] int? kmMin,
            [FromQuery] int? kmMax,
            [FromQuery] string? cambio,
            [FromQuery] string? categoria)
        {
            var query = _context.VEICULO.AsQueryable();

            if (!string.IsNullOrWhiteSpace(marca))
                query = query.Where(v => v.Marca == marca);

            if (!string.IsNullOrWhiteSpace(modelo))
                query = query.Where(v => v.Modelo == modelo);

            if (!string.IsNullOrWhiteSpace(cor))
                query = query.Where(v => v.Cor == cor);

            if (precoMax.HasValue)
                query = query.Where(v => v.Preco <= precoMax.Value);

            if (!string.IsNullOrWhiteSpace(cambio))
                query = query.Where(v => v.Cambio == cambio);

            // kmMin, kmMax e categoria ficam disponíveis
            // até confirmarmos os nomes exatos das colunas no banco.

            return Ok(await query.ToListAsync());
        }

        // GET: api/Veiculos/Filtros
        // Retorna valores distintos para filtros
        [HttpGet("Filtros")]
        public async Task<IActionResult> GetFiltros()
        {
            var marcas = await _context.VEICULO
                .Select(v => v.Marca)
                .Distinct()
                .ToListAsync();

            var modelos = await _context.VEICULO
                .Select(v => v.Modelo)
                .Distinct()
                .ToListAsync();

            var cores = await _context.VEICULO
                .Select(v => v.Cor)
                .Distinct()
                .ToListAsync();

            var cambios = await _context.VEICULO
                .Select(v => v.Cambio)
                .Distinct()
                .ToListAsync();

            return Ok(new
            {
                marcas,
                modelos,
                cores,
                cambios
            });
        }
    }
}