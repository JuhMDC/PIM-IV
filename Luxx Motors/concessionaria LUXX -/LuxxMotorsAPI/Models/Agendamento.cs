using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LuxxMotorsAPI.Models
{
    // O nome dentro de ("") deve ser exatamente o nome da tabela no seu SQL Server
    [Table("testdrive")] 
    public class Agendamento
    {
        [Key]
        [Column("id_testdrive")]
        public int Id { get; set; }

        [Column("id_cliente")]
        public int IdCliente { get; set; }

        [Column("id_veiculo")]
        public int IdVeiculo { get; set; }

        [Column("id_vendedor")]
        public int? IdVendedor { get; set; } // O '?' permite que seja nulo até o gerente definir

        [Column("horario")]
        public string Horario { get; set; } = string.Empty;

        [Column("data_agendamento")]
        public DateTime DataAgendamento { get; set; }

        [Column("status")]
        public string Status { get; set; } = "Agendado";
    }
}