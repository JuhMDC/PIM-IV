using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuxxMotorsAPI.Models
{
    [Table("Revisao", Schema = "dbo")]
    public class Revisao
    {
        [Key]
        [Column("Id_revisao")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id_revisao { get; set; }

        [Column("Id_cliente")]
        public int Id_cliente { get; set; }

        [Column("Id_veiculo")]
        public int Id_veiculo { get; set; }

        [Column("Id_vendedor")]
        public int Id_vendedor { get; set; }

        [Column("Status")]
        public string? Status { get; set; }

        [Column("Forma_pagamento")]
        public string? Forma_pagamento { get; set; }
    }
}