using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NSwag.Annotations;
using SimpleSellSystem.Backend.Database;
using SimpleSellSystem.Backend.Database.Entity;
using SimpleSellSystem.Backend.Models;

namespace SimpleSellSystem.Backend.Controllers
{
    [ApiController]
    [Route("/orders")]
    public class OrdersController : Controller
    {
        private IConfiguration Config { get; }

        public OrdersController(IConfiguration config)
        {
            Config = config;
        }

        [HttpGet]
        [OpenApiOperation("getOrdersList")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(List<Order>))]
        public IActionResult Index()
        {
            using(var context = new DatabaseContext(Config))
            {
                return Ok(context.Orders.Include(o => o.Product).ToList());
            }
        }

        [HttpPost]
        [OpenApiOperation("insertOrder")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(Order))]
        public IActionResult Index(OrderInsertData data)
        {
            using(var context = new DatabaseContext(Config))
            {
                var order = new Order()
                {
                    Amount = data.Amount,
                    ProductID = data.ProductID
                };

                context.Orders.Add(order);
                context.SaveChanges();

                return Ok(context.Orders.Include(o => o.Product).FirstOrDefault(o => o.ID == order.ID));
            }
        }

        [HttpPut("{orderID}/cancel")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(Order))]
        [SwaggerResponse(HttpStatusCode.NotFound, typeof(ErrorItem))]
        public IActionResult CancelOrder(int orderID)
        {
            using(var context = new DatabaseContext(Config))
            {
                var order = context.Orders.Include(o => o.Product).FirstOrDefault(o => o.ID == orderID);

                if(order == null)
                {
                    return NotFound(new ErrorItem() { Errors = new List<string>() { $"Objednávka s ID {orderID} nebyla nalezena," } });
                }

                order.CancelledAt = DateTime.Now;
                context.SaveChanges();

                return Ok(order);
            }
        }
    }
}