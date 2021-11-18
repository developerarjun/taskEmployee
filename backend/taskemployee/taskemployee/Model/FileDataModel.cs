using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace taskemployee.Model
{
    public class FileDataModel
    {
        [Required]
        public string ImportedBy { get; set; }
        public string Type { get; set; }
        public IFormFile XlsFile { get; set; }
        public EmployeeInfoViewModel empinfo { get; set; }
        public FileDataModel()//Create contractor
        {
            empinfo = new EmployeeInfoViewModel();
        }
    }
}
