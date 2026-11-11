using Microsoft.EntityFrameworkCore;
using LuxxMotorsAPI.Models;

namespace LuxxMotorsAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Veiculo> VEICULO { get; set; }
        public DbSet<Cliente> CLIENTE { get; set; }
        public DbSet<TestDrive> TESTDRIVE { get; set; }
        public DbSet<Vendedor> VENDEDOR { get; set; }
        public DbSet<Financiamento> FINANCIAMENTO { get; set; }
        public DbSet<Revisao> REVISAO { get; set; }
        public DbSet<Venda> VENDA { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Veiculo>()
                .Property(v => v.Preco)
                .HasColumnType("decimal(10,2)");

            modelBuilder.Entity<Cliente>()
                .Property(c => c.Renda_aproximada)
                .HasColumnType("decimal(10,2)");

            modelBuilder.Entity<Financiamento>()
                .Property(f => f.Valor_simulado)
                .HasColumnType("decimal(10,2)");

            modelBuilder.Entity<Venda>()
                .Property(v => v.valor_total)
                .HasColumnType("decimal(18,2)");
        }
    }
}