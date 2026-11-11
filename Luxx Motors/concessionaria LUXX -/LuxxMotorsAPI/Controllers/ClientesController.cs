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
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetClientes()
        {
            var clientes = await _context.CLIENTE.ToListAsync();
            return Ok(clientes);
        }

        [HttpPost]
        public async Task<IActionResult> PostCliente([FromBody] Cliente cliente)
        {
            try
            {
                _context.CLIENTE.Add(cliente);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    mensagem = "Cadastro da Luxx Motors concluído!",
                    id = cliente.Id_cliente
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensagem = "Erro interno ao salvar no banco",
                    detalhe = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpGet("verificar/{cpf}")]
        public async Task<IActionResult> VerificarCpf(string cpf)
        {
            var cliente = await _context.CLIENTE
                .FirstOrDefaultAsync(c => c.Cpf == cpf);

            if (cliente == null)
                return NotFound(new { mensagem = "Cliente não encontrado." });

            return Ok(cliente);
        }
    }
}