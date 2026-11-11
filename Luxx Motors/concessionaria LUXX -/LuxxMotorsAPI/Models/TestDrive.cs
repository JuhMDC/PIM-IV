using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuxxMotorsAPI.Models
{
    [Table("TESTDRIVE", Schema = "dbo")]
    public class TestDrive
    {
        [Key]
        [Column("Id_testedrive")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id_testdrive { get; set; }

        [Column("Id_cliente")]
        public int Id_cliente { get; set; }

        [Column("Id_veiculo")]
        public int Id_veiculo { get; set; }

        [Column("Id_vendedor")]
        public int? Id_vendedor { get; set; }

        [Column("Horario", TypeName = "time")]
        public TimeSpan Horario { get; set; }

        [Column("data_agendamento", TypeName = "date")]
        public DateTime Data_agendamento { get; set; }

        [Column("status")]
        public string Status { get; set; } = "Agendado";
    }
}