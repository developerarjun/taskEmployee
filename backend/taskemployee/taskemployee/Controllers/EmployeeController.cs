using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using taskemployee.Entity;
using taskemployee.Services;

namespace taskemployee.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeServices _employee;
        public EmployeeController(IEmployeeServices employee)
        {
            _employee = employee;
        }

        [HttpPost]
        public IActionResult AddEmployee([FromBody]Employee emp)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _employee.CreateEmployee(emp);
                    _employee.SaveChanges();
                    return Ok(new { message = "Successfully Saved" });

                }
                catch (Exception)
                {
                    return BadRequest(new { message = "SomeThing Went Wrong" });
                }
            }
            return BadRequest(new { message = "SomeThing Went Wrong" });
        }
        [HttpGet]
        public IActionResult GetEmployee()
        {
            if (ModelState.IsValid)
            {
                try
                {
                   var emp = _employee.GetAllEmployee();
                   return Ok(emp);
                }
                catch (Exception)
                {
                    return BadRequest(new { message = "SomeThing Went Wrong" });
                }
            }
            return BadRequest(new { message = "SomeThing Went Wrong" });
        }
        [HttpPut("{id}")]
        public IActionResult UpdateEmployee([FromBody] Employee emp, int id)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _employee.UpdateEmployee(emp,id);
                    _employee.SaveChanges();
                    return Ok(new { message = "Successfully Updated" });
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

