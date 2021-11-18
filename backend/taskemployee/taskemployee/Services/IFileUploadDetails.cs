using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using taskemployee.Entity;

namespace taskemployee.Services
{
    public interface IFileUploadDetails
    {
        string GetExcelFile(IFormFile file, string UploadBy);
        Task<bool> SaveChanges();
    }
}
