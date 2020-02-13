using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NSwag.Annotations;
using SimpleSaleSystem.Backend.Database;
using SimpleSaleSystem.Backend.Database.Entity;
using SimpleSaleSystem.Backend.Models;

namespace SimpleSaleSystem.Backend.Controllers
{
    [ApiController]
    [Route("/products")]
    public class ProductsController : Controller
    {
        private IConfiguration Config { get; }

        public ProductsController(IConfiguration config)
        {
            Config = config;
        }

        [HttpGet]
        [OpenApiOperation("getProductsList")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(Product))]
        public IActionResult Index()
        {
            using (var context = new DatabaseContext(Config))
            {
                return Ok(context.Products.ToList());
            }
        }

        [HttpPost]
        [OpenApiOperation("createProduct")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(Product))]
        public IActionResult Index(ProductUpdateData product)
        {
            using (var context = new DatabaseContext(Config))
            {
                var newProduct = new Product()
                {
                    Volume = product.Volume,
                    Price = product.Price,
                    CanSell = true,
                    Name = product.Name
                };

                context.Products.Add(newProduct);
                context.SaveChanges();

                return Ok(newProduct);
            }
        }

        [HttpPut("{productId}/toggle")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(CanSellItem))]
        [SwaggerResponse(HttpStatusCode.NotFound, typeof(ErrorItem), Description = "Product not found")]
        public IActionResult ToggleProduct(int productId)
        {
            using (var context = new DatabaseContext(Config))
            {
                var product = context.Products.FirstOrDefault(o => o.ID == productId);

                if (product == null)
                {
                    return NotFound(new ErrorItem() { Errors = new List<string>() { $"Product s ID {productId} nebyl nalezen." } });
                }

                product.CanSell = !product.CanSell;
                context.SaveChanges();

                return Ok(new CanSellItem()
                {
                    CanSell = product.CanSell,
                    ID = product.ID
                });
            }
        }

        [HttpPut("{productId}")]
        [OpenApiOperation("updateProduct")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(Product))]
        [SwaggerResponse(HttpStatusCode.NotFound, typeof(ErrorItem))]
        public IActionResult Index(int productId, [FromBody] ProductUpdateData data)
        {
            using (var context = new DatabaseContext(Config))
            {
                var product = context.Products.FirstOrDefault(o => o.ID == productId);

                if(product == null)
                {
                    return NotFound(new ErrorItem() { Errors = new List<string>() { $"Product s ID {productId} nebyl nalezen." } });
                }

                product.Name = data.Name;
                product.Price = data.Price;
                product.Volume = data.Volume;

                context.SaveChanges();

                return Ok(product);
            }
        }
    }
}