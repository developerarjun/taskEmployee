using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using taskemployee.Entity;
using taskemployee.Model;

namespace taskemployee.Services
{
    public interface IUserService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model);
        IEnumerable<User> GetAll();
        User GetById(int id);
    }
}
