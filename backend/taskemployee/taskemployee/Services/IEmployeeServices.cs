using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using taskemployee.Entity;

namespace taskemployee.Services
{
   public interface IEmployeeServices
    {
        Task<bool> SaveChanges();
        IEnumerable<Employee> GetAllEmployee();
        void CreateEmployee(Employee employee);
        void UpdateEmployee(Employee employee,int id);
    }
}
