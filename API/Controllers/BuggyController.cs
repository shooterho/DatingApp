using System;
using System.Security.Cryptography.X509Certificates;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    private DataContext dataContext;
    public BuggyController(DataContext dataContext)
    {
        this.dataContext = dataContext;
    }

    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetAuth()
    {
        return "secret text";
    }
    [HttpGet("not-found")]
    public ActionResult<AppUser> GetNotFound()
    {
        var thing = dataContext.Users.Find(-1);
        if (thing == null) return NotFound();
        return thing;
    }
    [HttpGet("server-error")]
    public ActionResult<AppUser> GetServerError()
    {
        var thing = dataContext.Users.Find(-1) ?? throw new Exception("A bad thing has happened(toString can't be used on null)");
        return thing;
    }
    [HttpGet("bad-request")]
    public ActionResult<AppUser> GetBadRequest()
    {
        return BadRequest("This is not a good request");
    }

}
