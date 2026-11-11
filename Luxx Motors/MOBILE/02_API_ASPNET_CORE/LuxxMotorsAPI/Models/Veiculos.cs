using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuxxMotorsAPI.Models
{
    [Table("Veiculo", Schema = "dbo")]
    public class Veiculo
    {
        [Key]
        [Column("Id_Veiculo")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id_veiculo { get; set; }

        [Column("Marca")]
        public string Marca { get; set; } = string.Empty;

        [Column("Modelo")]
        public string Modelo { get; set; } = string.Empty;

        [Column("Ano")]
        public int Ano { get; set; }

        [Column("Capacidade")]
        public int? Capacidade { get; set; }

        [Column("Preco")]
        public decimal Preco { get; set; }

        [Column("Cor")]
        public string Cor { get; set; } = string.Empty;

        [Column("Cambio")]
        public string Cambio { get; set; } = string.Empty;

        [Column("Status")]
        public string Status { get; set; } = string.Empty;

        [Column("Categoria")]
        public string Categoria { get; set; } = string.Empty;

        [Column("Quilometragem")]
        public int Quilometragem { get; set; }
    }
}