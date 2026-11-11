using System.ComponentModel.DataAnnotations;

namespace LuxxMotorsAPI.Models
{
    public class Financiamento
    {
        [Key]
        public int Id_financiamento { get; set; }
        public int Id_cliente { get; set; }
        public int Id_veiculo { get; set; }
        public int Parcelas { get; set; }
        public decimal Valor_simulado { get; set; }
        public decimal juros { get; set; } = 1.50m; // Juros fixo de 1.50% ao mês
        public DateTime Data_simulacao { get; set; } = DateTime.Now;
    }
}