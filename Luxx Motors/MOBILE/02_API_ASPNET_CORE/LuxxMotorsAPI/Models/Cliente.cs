using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuxxMotorsAPI.Models
{
    [Table("Cliente", Schema = "dbo")]
    public class Cliente
    {
        [Key]
        [Column("Id_cliente")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id_cliente { get; set; }

        [Required]
        [Column("Nome")]
        [StringLength(150)]
        public string Nome_completo { get; set; } = string.Empty;

        [Column("Data_nascimento", TypeName = "date")]
        public DateTime Data_nascimento { get; set; }

        [Column("CPF")]
        [StringLength(14)]
        public string? Cpf { get; set; }

        [Column("Telefone")]
        [StringLength(20)]
        public string? Telefone { get; set; }

        [Column("Email")]
        [StringLength(100)]
        public string? Email { get; set; }

        [Column("Renda_aproximada", TypeName = "decimal(10,2)")]
        public decimal? Renda_aproximada { get; set; }
    }
}