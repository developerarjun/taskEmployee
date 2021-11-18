using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using taskemployee.Entity;

namespace taskemployee.Services
{
    public class FileUploadDetails : IFileUploadDetails
    {
        private readonly AppDbContext _context;
        public IConfiguration Configuration { get; }

        public FileUploadDetails(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }
        public string GetExcelFile(IFormFile file, string UploadBy)
        {
            var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
            var isExtension = (extension == ".xlsx" || extension == ".xls" || extension == ".csv");
            int skipcount = 0;
            int rowcount = 0;
            string skip = "";
            if (isExtension)
            {
                string fileName = DateTime.Now.Ticks + extension;
                var path = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\EmployeeFiles", fileName);
                var pathBuilt = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\EmployeeFiles");
                if (!Directory.Exists(pathBuilt))
                {
                    Directory.CreateDirectory(pathBuilt);
                }
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    file.CopyToAsync(stream);
                }
                DataTable dt = ReadFileExcel(path,extension);
                
                foreach (DataRow dr in dt.Rows)
                {
                    rowcount++;
                    if(dr == null)
                    {
                        skipcount++;
                        skip = skip + " " + rowcount + ",";
                    }
                    else
                    {
                        var emp = new Employee();
                        emp.Designation= dr["Designation"].ToString();
                        emp.DOB = dr["DOB"].ToString();
                        emp.FullName = dr["FullName"].ToString();
                        emp.Gender = dr["GENDER"].ToString();
                        emp.Salary = Convert.ToDecimal(dr["SALARY"].ToString());
                        emp.ImportedBy = UploadBy;
                        _context.employees.Add(emp);
                    }
                }
            }
            else
            {
                throw new DataMisalignedException();
            }
            return skip;
        }
        private DataTable ReadFileExcel(string fpath, string fExt)
        {
            DataTable dt = new DataTable();
            try
            {
                string connString = String.Empty;
                switch (fExt)
                {
                    case ".xls":
                        connString=Configuration.GetConnectionString("xlsConnection");
                        break;
                    case ".xlsx":
                        connString = Configuration.GetConnectionString("xlsxConnection");
                        break;
                }
                connString = string.Format(connString, fpath);
                using (OleDbConnection excelOledbConnection = new OleDbConnection(connString))
                {
                    using (OleDbCommand excelDbCommand = new OleDbCommand())
                    {
                        using (OleDbDataAdapter excelDataAdapter = new OleDbDataAdapter())
                        {
                            excelDbCommand.Connection = excelOledbConnection;

                            excelOledbConnection.Open();
                            DataTable excelSchema = excelOledbConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                            string sheetName = excelSchema.Rows[0]["TABLE_NAME"].ToString();
                            excelOledbConnection.Close();
                            excelOledbConnection.Open();
                            excelDbCommand.CommandText = "SELECT * From [" + sheetName + "]";
                            excelDataAdapter.SelectCommand = excelDbCommand;
                            excelDataAdapter.Fill(dt);
                            excelOledbConnection.Close();
                        }
                    }
                }
            }
            catch
            {
                throw;
            }
            return dt;
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
    }
}
