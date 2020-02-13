using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SimpleSaleSystem.Backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddSwaggerDocument(c =>
            {
                c.PostProcess = doc =>
                {
                    doc.Info.Version = "v1";
                    doc.Info.Title = "Super Simple SellSystem API";
                    doc.Info.TermsOfService = "None";
                };
            });

            services.AddCors();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                app.UseHsts();

            app
                .UseStaticFiles()
                .UseOpenApi()
                .UseSwaggerUi3(c => c.CustomStylesheetPath = "/swagger/ui/custom.css")
                .UseHttpsRedirection()
                .UseCors(o => o.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader())
                .UseMiddleware<CorsMiddleware>()
                .UseMvc();
        }
    }
}
