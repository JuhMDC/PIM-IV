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
    public class TestDriveController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TestDriveController(AppDbContext context) 
        { 
            _context = context; 
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestDrive>>> GetTestDrives()
        {
            try 
            {
                // Certifique-se de que este nome após o '_context.' é igual ao do AppDbContext
                var lista = await _context.TESTDRIVE.ToListAsync(); 
                return Ok(lista);
            }
            catch (Exception ex)
            {
                // Esse log vai imprimir o erro exato no seu terminal do dotnet run
                Console.WriteLine($"[ERRO NO CONTEXTO TESTDRIVE]: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[DETALHE DO BANCO]: {ex.InnerException.Message}");
                }
                
                return StatusCode(500, $"Erro interno no Test Drive: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<TestDrive>> PostAgendamento(TestDrive agendamento)
        {
            Console.WriteLine("Recebendo agendamento: " + System.Text.Json.JsonSerializer.Serialize(agendamento));
            agendamento.Status = "Pendente";
            _context.TESTDRIVE.Add(agendamento);
            await _context.SaveChangesAsync();
            return Ok(agendamento);
        }
    }

    public class TestDriveRequest
    {
        public int id_cliente { get; set; }
        public int id_veiculo { get; set; }
        public int? id_vendedor { get; set; } // Opcional no início
        public string horario { get; set; } = string.Empty;
        public DateTime data_agendamento { get; set; }
        public string status { get; set; } = "Agendado";
    }
}