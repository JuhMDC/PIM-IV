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
        public class VendedoresController : ControllerBase
        {
            private readonly AppDbContext _context;

            public VendedoresController(AppDbContext context)
            {
                _context = context;
            }

            [HttpGet]
            public async Task<ActionResult<IEnumerable<Vendedor>>> GetVendedores()
            {
                return await _context.VENDEDOR.ToListAsync();
            }
        }
}