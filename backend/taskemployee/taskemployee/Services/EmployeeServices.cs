using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using taskemployee.Entity;

namespace taskemployee.Services
{
    public class EmployeeServices : IEmployeeServices
    {
        private readonly AppDbContext _context;

        public EmployeeServices(AppDbContext context)
        {
            _context = context;
        }
        public void CreateEmployee(Employee employee)
        {
            if(employee == null)
            {
                throw new ArgumentNullException(nameof(employee));
            }
            if (employee.profileimage != null)
            {
                string[] dataURL = employee.profileimage.Split(new char[] { ',' }, 2);
                byte[] file = Convert.FromBase64String(dataURL[1]);
                employee.EmployeeImage = file;
            }
            _context.employees.Add(employee);
           
        }

        public IEnumerable<Employee> GetAllEmployee()
        {
            var emp = _context.employees.ToList();
            foreach(var e in emp)
            {
                if(e.EmployeeImage != null)
                {
                    string b = Convert.ToBase64String(e.EmployeeImage, 0, e.EmployeeImage.Length);
                    e.profileimage = "data:image/png;base64," + b;
                }
            }
            return emp;
        }

        public async Task<bool> SaveChanges()
        {
            var transaction = _context.Database.BeginTransaction();
            try
            {
                await _context.SaveChangesAsync();
                transaction.Commit();
            }
            catch (DbUpdateConcurrencyException)
            {
                transaction.Rollback();
                return false;
            }
            return true;
        }

        public void UpdateEmployee(Employee employee,int id)
        {
            if (id != employee.Id)
            {
                throw new ArgumentNullException(nameof(employee));
            }
            try
            {
                var emp = _context.employees.Where(x => x.Id == id).First();
                emp.FullName = employee.FullName;
                emp.DOB = employee.DOB;
                emp.Designation = employee.Designation;
                emp.Gender = employee.Gender;
                emp.Salary = employee.Salary;
                if (employee.profileimage != null)
                {
                    string[] dataURL = employee.profileimage.Split(new char[] { ',' }, 2);
                    byte[] file = Convert.FromBase64String(dataURL[1]);
                    emp.EmployeeImage = file;
                }
                _context.employees.Update(emp);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }
    }
}
