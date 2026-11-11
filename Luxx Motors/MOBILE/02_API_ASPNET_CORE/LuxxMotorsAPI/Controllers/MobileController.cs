using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Text.RegularExpressions;
using LuxxMotorsAPI.Data;
using LuxxMotorsAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace LuxxMotorsAPI.Controllers;

// API específica para compradores. Os controladores administrativos originais
// permanecem protegidos por JWT. NÃO exponha /api/clientes ao público.
[ApiController]
[Route("api/mobile")]
public class MobileController : ControllerBase
{
    private readonly AppDbContext _db;
    public MobileController(AppDbContext db) => _db = db;

    // Catálogo de dados não sensíveis disponível sem login.
    [AllowAnonymous]
    [HttpGet("veiculos")]
    public async Task<IActionResult> ListarVeiculos()
    {
        var carros = await _db.VEICULO.AsNoTracking()
            .OrderByDescending(x => x.Id_veiculo).ToListAsync();

        var resultado = carros.Select(v => new
        {
            id = v.Id_veiculo,
            marca = v.Marca,
            modelo = v.Modelo,
            ano = v.Ano,
            preco = v.Preco,
            cor = v.Cor,
            cambio = v.Cambio,
            status = v.Status,
            categoria = v.Categoria,
            quilometragem = v.Quilometragem,
            imagemUrl = CaminhoFoto(v)
        });
        return Ok(resultado);
    }

    [AllowAnonymous]
    [HttpGet("veiculos/filtros")]
    public async Task<IActionResult> Filtros()
    {
        var carros = await _db.VEICULO.AsNoTracking().ToListAsync();
        return Ok(new
        {
            marcas = carros.Select(v => v.Marca).Distinct().OrderBy(x => x),
            modelos = carros.Select(v => v.Modelo).Distinct().OrderBy(x => x),
            cores = carros.Select(v => v.Cor).Distinct().OrderBy(x => x),
            cambios = carros.Select(v => v.Cambio).Distinct().OrderBy(x => x),
            veiculosCompletos = carros.Select(v => new { id_veiculo = v.Id_veiculo, modelo = v.Modelo })
        });
    }

    [AllowAnonymous]
    [EnableRateLimiting("mobile-publico")]
    [HttpPost("testdrives")]
    public async Task<IActionResult> CriarTestDrive([FromBody] NovoTestDrive req)
    {
        if (!ValidarContato(req, out var nasc, out var cpf))
            return BadRequest(new { mensagem = "Confira os dados pessoais, o CPF e a data de nascimento." });

        if (!DateTime.TryParseExact(req.DataAgendamento, "yyyy-MM-dd", CultureInfo.InvariantCulture,
                DateTimeStyles.None, out var agenda) || agenda.Date < DateTime.Today || agenda.Date > DateTime.Today.AddMonths(6))
            return BadRequest(new { mensagem = "Informe uma data de agendamento entre hoje e seis meses." });

        if (!TimeSpan.TryParseExact(req.Horario, @"hh\:mm", CultureInfo.InvariantCulture, out var horario)
            || horario < TimeSpan.FromHours(9) || horario > TimeSpan.FromHours(17))
            return BadRequest(new { mensagem = "Horário inválido. Escolha entre 09:00 e 17:00." });

        var carro = await _db.VEICULO.AsNoTracking().FirstOrDefaultAsync(x => x.Id_veiculo == req.IdVeiculo);
        if (carro == null || Vendido(carro))
            return BadRequest(new { mensagem = "Veículo indisponível para agendamento." });

        // Seleciona um vendedor existente, em vez de atribuir um ID aleatório.
        var vendedor = await _db.VENDEDOR.AsNoTracking()
            .OrderBy(x => x.Id_vendedor).Select(x => (int?)x.Id_vendedor).FirstOrDefaultAsync();
        if (!vendedor.HasValue)
            return StatusCode(503, new { mensagem = "Agendamento indisponível no momento: nenhum consultor cadastrado." });

        try
        {
            await using var transacao = await _db.Database.BeginTransactionAsync();
            var cliente = await ClienteConfirmado(req, cpf, nasc);
            if (cliente == null)
                return Conflict(new { mensagem = "Não foi possível validar os dados cadastrais. Contate a concessionária." });
            var td = new TestDrive
            {
                Id_cliente = cliente.Id_cliente,
                Id_veiculo = req.IdVeiculo,
                Id_vendedor = vendedor,
                Horario = horario,
                Data_agendamento = agenda,
                Status = "Pendente"
            };
            _db.TESTDRIVE.Add(td);
            await _db.SaveChangesAsync();
            await transacao.CommitAsync();
            return Ok(new { protocolo = td.Id_testdrive, mensagem = "Solicitação registrada. Sujeita a confirmação." });
        }
        catch (DbUpdateException)
        {
            return StatusCode(503, new { mensagem = "Não foi possível registrar o agendamento. Tente novamente." });
        }
    }

    [AllowAnonymous]
    [EnableRateLimiting("mobile-publico")]
    [HttpPost("financiamentos")]
    public async Task<IActionResult> CriarSimulacao([FromBody] NovaSimulacao req)
    {
        if (!ValidarContato(req, out var nasc, out var cpf))
            return BadRequest(new { mensagem = "Confira os dados pessoais, o CPF e a data de nascimento." });
        if (req.Parcelas is not (12 or 24 or 36 or 48 or 60) || req.TaxaMensal < 0 || req.TaxaMensal > 10)
            return BadRequest(new { mensagem = "Prazo ou taxa inválidos." });
        var carro = await _db.VEICULO.AsNoTracking().FirstOrDefaultAsync(x => x.Id_veiculo == req.IdVeiculo);
        if (carro == null || Vendido(carro) || carro.Preco <= 0 || req.Entrada < 0 || req.Entrada >= carro.Preco)
            return BadRequest(new { mensagem = "Veículo ou entrada indisponível para simulação." });

        try
        {
            await using var transacao = await _db.Database.BeginTransactionAsync();
            var cliente = await ClienteConfirmado(req, cpf, nasc);
            if (cliente == null)
                return Conflict(new { mensagem = "Não foi possível validar os dados cadastrais. Contate a concessionária." });
            var f = new Financiamento
            {
                Id_cliente = cliente.Id_cliente,
                Id_veiculo = req.IdVeiculo,
                Parcelas = req.Parcelas,
                Valor_simulado = carro.Preco - req.Entrada, // Valor financiado, calculado no servidor.
                juros = req.TaxaMensal,
                Data_simulacao = DateTime.Now,
            };
            _db.FINANCIAMENTO.Add(f);
            await _db.SaveChangesAsync();
            await transacao.CommitAsync();
            return Ok(new { protocolo = f.Id_financiamento, mensagem = "Proposta de simulação registrada." });
        }
        catch (DbUpdateException)
        {
            return StatusCode(503, new { mensagem = "Não foi possível registrar a simulação. Tente novamente." });
        }
    }

    private static bool Vendido(Veiculo carro) =>
        carro.Status?.Contains("vendido", StringComparison.OrdinalIgnoreCase) == true;

    // Não retornamos CPF, e-mail, telefone ou registros administrativos no catálogo.
    private static bool ValidarContato(DadosCliente dados, out DateTime nascimento, out string cpf)
    {
        cpf = Regex.Replace(dados.Cpf ?? string.Empty, @"\D", string.Empty);
        var dataOk = DateTime.TryParseExact(dados.DataNascimento, "yyyy-MM-dd",
            CultureInfo.InvariantCulture, DateTimeStyles.None, out nascimento);
        return dataOk && nascimento.Date < DateTime.Today && nascimento.Year >= 1900 &&
            cpf.Length == 11 && CpfValido(cpf) &&
            !string.IsNullOrWhiteSpace(dados.Nome) && dados.Nome.Trim().Length >= 3 &&
            new EmailAddressAttribute().IsValid(dados.Email) &&
            Regex.Replace(dados.Telefone ?? string.Empty, @"\D", "").Length >= 10;
    }

    // Dados de CPF existente só podem ser associados se nome, e-mail e nascimento conferirem.
    // Ainda requer verificação forte de identidade (OTP) antes de uso público em produção.
    private async Task<Cliente?> ClienteConfirmado(DadosCliente dados, string cpf, DateTime nascimento)
    {
        string formatado = $"{cpf[..3]}.{cpf.Substring(3,3)}.{cpf.Substring(6,3)}-{cpf.Substring(9,2)}";
        var cliente = await _db.CLIENTE.FirstOrDefaultAsync(c => c.Cpf == cpf || c.Cpf == formatado);
        if (cliente != null)
        {
            if (!string.Equals(cliente.Email?.Trim(), dados.Email.Trim(), StringComparison.OrdinalIgnoreCase)
                || !string.Equals(cliente.Nome_completo.Trim(), dados.Nome.Trim(), StringComparison.OrdinalIgnoreCase)
                || cliente.Data_nascimento.Date != nascimento.Date) return null;
            return cliente;
        }
        cliente = new Cliente
        {
            Nome_completo = dados.Nome.Trim(),
            Cpf = formatado,
            Email = dados.Email.Trim().ToLowerInvariant(),
            Telefone = dados.Telefone.Trim(),
            Data_nascimento = nascimento,
        };
        _db.CLIENTE.Add(cliente);
        await _db.SaveChangesAsync();
        return cliente;
    }

    private static bool CpfValido(string cpf)
    {
        if (cpf.Length != 11 || cpf.Distinct().Count() == 1) return false;
        for (int limite = 9; limite <= 10; limite++)
        {
            int soma = 0;
            for (int i = 0; i < limite; i++) soma += (cpf[i] - '0') * (limite + 1 - i);
            int digito = ((soma * 10) % 11) % 10;
            if (digito != cpf[limite] - '0') return false;
        }
        return true;
    }

    private static string? CaminhoFoto(Veiculo v)
    {
        var chave = $"{v.Marca.Trim()}|{v.Modelo.Trim()}|{v.Cor.Trim()}";
        return Fotos.TryGetValue(chave, out var arquivo) ? $"/veiculos/{arquivo}" : null;
    }

    private static readonly Dictionary<string, string> Fotos = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Fiat|Mobi Like|Branco" ] = "mobi-branco.webp",
        ["Volkswagen|Gol 1.0|Prata" ] = "gol-prata.webp",
        ["Chevrolet|Onix|Preto" ] = "onix-preto.webp",
        ["Hyundai|HB20|Vermelho" ] = "hb20-vermelho.webp",
        ["Ford|Ka|Branco" ] = "ford_ka-branco.webp",
        ["Renault|Kwid|Cinza" ] = "kwid-cinza.webp",
        ["Fiat|Argo|Preto" ] = "argo-preto.webp",
        ["Volkswagen|Polo|Azul" ] = "polo-azul.webp",
        ["Chevrolet|Onix Plus|Prata" ] = "onix_plus-prata.webp",
        ["Hyundai|HB20S|Branco" ] = "hb20s-branco.webp",
        ["Toyota|Etios|Cinza" ] = "etios-cinza.webp",
        ["Nissan|Versa|Preto" ] = "versa-preto.webp",
        ["Fiat|Cronos|Branco" ] = "cronos-branco.webp",
        ["Chevrolet|Joy|Prata" ] = "joy-prata.webp",
        ["Toyota|Corolla|Preto" ] = "corolla-preto.webp",
        ["Jeep|Compass|Branco" ] = "compass-branco.webp",
        ["Honda|Civic|Cinza" ] = "civic-cinza.webp",
        ["Volkswagen|Jetta GLI|Vermelho" ] = "gli-vermelho.webp",
        ["BMW|320i|Azul" ] = "320i-azul.webp",
        ["Fiat|Strada|Branco" ] = "strada-branco.webp",
        ["Volkswagen|Saveiro|Prata" ] = "saveiro-prata.webp",
        ["Toyota|Hilux|Preto" ] = "hilux-preto.webp",
        ["Chevrolet|S10|Cinza" ] = "s10-cinza.webp",
        ["Ford|Ranger|Branco" ] = "ranger-branco.webp",
        ["Mitsubishi|L200 Triton|Prata" ] = "l200-prata.webp",    };
}

public class DadosCliente
{
    [Required, StringLength(150, MinimumLength = 3)] public string Nome { get; set; } = "";
    [Required, EmailAddress, StringLength(100)] public string Email { get; set; } = "";
    [Required, StringLength(20)] public string Telefone { get; set; } = "";
    [Required] public string Cpf { get; set; } = "";
    [Required] public string DataNascimento { get; set; } = "";
}
public class NovoTestDrive : DadosCliente
{
    [Range(1, int.MaxValue)] public int IdVeiculo { get; set; }
    [Required] public string DataAgendamento { get; set; } = "";
    [Required] public string Horario { get; set; } = "";
}
public class NovaSimulacao : DadosCliente
{
    [Range(1, int.MaxValue)] public int IdVeiculo { get; set; }
    public decimal Entrada { get; set; }
    public int Parcelas { get; set; }
    public decimal TaxaMensal { get; set; }
}
