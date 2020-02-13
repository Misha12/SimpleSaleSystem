using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SimpleSaleSystem.Backend.Database.Entity;

namespace SimpleSaleSystem.Backend.Database
{
    public class DatabaseContext : DbContext
    {
        private string ConnectionString { get; }

        public DatabaseContext(IConfiguration config) : this(config["ConnectionString"])
        {
        }

        public DatabaseContext(string connectionString)
        {
            ConnectionString = connectionString;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>().HasOne(o => o.Product).WithMany(o => o.Orders);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(ConnectionString);
        }

        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<Product> Products { get; set; }
    }
}
