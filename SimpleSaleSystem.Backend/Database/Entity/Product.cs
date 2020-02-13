using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleSaleSystem.Backend.Database.Entity
{
    [Table("Products")]
    public class Product
    {
        [Key]
        [Column]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Column]
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Column]
        [Required]
        [StringLength(50)]
        public string Volume { get; set; }

        [Column]
        public bool CanSell { get; set; }

        [Column]
        [Required]
        public decimal Price { get; set; }

        [JsonIgnore]
        public virtual ISet<Order> Orders { get; set; }

        public Product()
        {
            Orders = new HashSet<Order>();
        }
    }
}
