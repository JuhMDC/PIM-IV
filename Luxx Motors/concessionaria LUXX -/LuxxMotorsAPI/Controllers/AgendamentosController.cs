using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LuxxMotorsAPI.Data;
using LuxxMotorsAPI.Models;
using  Microsoft.AspNetCore.Authorization;
namespace LuxxMotorsAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AgendamentosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AgendamentosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CriarAgendamento(
            [FromBody] TestDrive agendamento)
        {
            if (agendamento == null)
                return BadRequest("Dados inválidos.");

            try
            {
                _context.TESTDRIVE.Add(agendamento);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    mensagem = "Agendamento realizado!",
                    id = agendamento.Id_testdrive
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
        public async Task<IActionResult> ConsultarAgendamentos()
        {
            var agendamentos = await _context.TESTDRIVE
                .AsNoTracking()
                .OrderByDescending(a => a.Data_agendamento)
                .ToListAsync();

            return Ok(agendamentos);
        }
    }
}