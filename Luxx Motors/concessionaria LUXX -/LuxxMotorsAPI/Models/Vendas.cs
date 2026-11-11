using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuxxMotorsAPI.Models
{
    [Table("VENDAS")]
    public class Venda
    {
        [Key]
        public int id_venda { get; set; }

        [Required]
        public int id_cliente { get; set; }

        [Required]
        public int id_veiculo { get; set; }

        [Required]
        public int id_vendedor { get; set; }

        [Required]
        public DateTime data_venda { get; set; }
        [Required]
        [Column("valor_final", TypeName = "decimal(18,2)")]
        public decimal valor_total { get; set; }

        public string? forma_pagamento { get; set; }

        public string? observacao { get; set; }

        // ADICIONADO PARA O JAVASCRIPT: Como o banco não tem a coluna 'status',
        // uso o [NotMapped] para o .NET não tentar buscar no SQL, 
        // mas o JavaScript vai conseguir ler o valor fixo "Finalizado"!
        [NotMapped]
        public string status { get; set; } = "Concluído";
    }
}