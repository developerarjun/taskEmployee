using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace taskemployee.Entity
{
    public class Employee
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "FullName must be requried")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Date of Birth must be requried")]
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        public string DOB { get; set; }
        [Required(ErrorMessage = "Gender must be requried")]
        public string Gender{ get; set; }
        [Required(ErrorMessage = "Salary must be requried")]
        public decimal Salary { get; set; }
        [Required(ErrorMessage = "Designation must be requried")]
        public string Designation { get; set; }
        public byte[] EmployeeImage { get; set; }
        [NotMapped]
        public string profileimage { get; set; }
        public DateTime ImportedDate { get; set; }
        public string ImportedBy { get; set; }
        public Employee()
        {
            this.ImportedDate = DateTime.UtcNow;
        }
    }
}
