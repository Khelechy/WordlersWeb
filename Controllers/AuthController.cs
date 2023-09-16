using Microsoft.AspNetCore.Mvc;

namespace Wordlerweb.Controllers
{
    public class AuthController : Controller
    {

        public IActionResult Login()
        {
            return View();
        }
        
    }
}
