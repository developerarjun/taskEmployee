using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace taskemployee.Model
{
    public class EmployeeInfoViewModel
    {
        [Required(ErrorMessage = "FullName must be requried")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Date of Birth must be requried")]
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        public string DOB { get; set; }
        [Required(ErrorMessage = "Gender must be requried")]
        public string Gender { get; set; }
        [Required(ErrorMessage = "Salary must be requried")]
        public decimal Salary { get; set; }
        [Required(ErrorMessage = "Designation must be requried")]
        public string Designation { get; set; }
        public List<EmployeeInfoViewModel> employeeList { get; set; }
        public EmployeeInfoViewModel()
        {
            employeeList = new List<EmployeeInfoViewModel>();
        }
    }
}
