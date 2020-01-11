using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleSellSystem.Backend.Database.Entity
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        [Column]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Column]
        [Required]
        public int ProductID { get; set; }

        [ForeignKey("ProductID")]
        public Product Product { get; set; }

        [Column]
        [Required]
        public double Amount { get; set; }

        [Column]
        public DateTime? CancelledAt { get; set; }
    }
}
