using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleSellSystem.Backend
{
    public class CorsMiddleware
    {
        private RequestDelegate Next { get; }

        public CorsMiddleware(RequestDelegate next)
        {
            Next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if(context.Request.Method == "OPTIONS")
            {
                context.Response.StatusCode = 200;
                await context.Response.WriteAsync("OK");
                return;
            }

            await Next.Invoke(context);
        }
    }
}
