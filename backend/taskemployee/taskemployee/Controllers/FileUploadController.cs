using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using taskemployee.Services;

namespace taskemployee.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class FileUploadController : ControllerBase
    {
        private readonly IFileUploadDetails _details;
        public FileUploadController(IFileUploadDetails details)
        {
            _details = details;
        }
        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file, string UploadBy)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var s = _details.GetExcelFile(file, UploadBy);
                    await _details.SaveChanges();
                    return Ok(new { message = s });

                }
                catch (Exception)
                {
                    return BadRequest(new { message = "SomeThing Went Wrong" });
                }
            }
            return BadRequest(new { message = "SomeThing Went Wrong" });
        }
    }
}
