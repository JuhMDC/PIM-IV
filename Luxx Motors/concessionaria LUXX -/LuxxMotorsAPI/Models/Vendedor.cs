using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuxxMotorsAPI.Models
{
    [Table("VENDEDOR", Schema = "dbo")]
    public class Vendedor
    {
        [Key]
        [Column("Id_vendedor")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id_vendedor { get; set; }

        [Required]
        [Column("Nome")]
        [StringLength(150)]
        public string Nome { get; set; } = string.Empty;

        [Column("Endereco")]
        [StringLength(200)]
        public string? Endereco { get; set; }

        [Column("Email")]
        [StringLength(100)]
        public string? Email { get; set; }

        [Column("Telefone")]
        [StringLength(20)]
        public string? Telefone { get; set; }

        [Column("CPF")]
        [StringLength(14)]
        public string? CPF { get; set; }

        [Column("Vendas")]
        public int? Vendas { get; set; }
    }
}